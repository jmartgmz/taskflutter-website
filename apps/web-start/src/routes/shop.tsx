import { createFileRoute } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { Plus, ShoppingBag, Sparkles, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  useApiMutation,
  useApiQuery,
  useCurrentUser,
} from '../integrations/api';
import { PointsDisplay } from '../components/PointsDisplay';
import { ShopItemForm } from '../components/ShopItemForm';
import { Header } from '../components/Header';
import { Toast } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';
import type { BackendShopItem } from '../types/backend';

export const Route = createFileRoute('/shop')({
  component: ShopPage,
});

function ShopPage() {
  const {
    isAuthenticated,
    isLoading: auth0Loading,
    user: auth0User,
  } = useAuth0();
  const { data: currentUser, showLoading } = useCurrentUser();
  const points = currentUser?.userPoints || 0;
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    item: BackendShopItem;
  } | null>(null);

  // Fetch shop items from backend
  const { data: shopItems, isAuthPending } = useApiQuery<
    Array<BackendShopItem>
  >(['shop-items'], '/shop-items');

  // Purchase mutation
  const purchaseMutation = useApiMutation<{ id: string }, BackendShopItem>({
    endpoint: (variables) => ({
      path: `/shop-items/${variables.id}/purchase`,
      method: 'POST',
    }),
    invalidateKeys: [['shop-items'], ['users', 'me']], // Refresh shop items and user points
  });

  // Create shop item mutation
  const createShopItemMutation = useApiMutation<
    {
      itemName: string;
      itemType: string;
      itemColor: string;
      itemCost: number;
      itemDescription?: string;
    },
    BackendShopItem
  >({
    path: '/shop-items',
    method: 'POST',
    invalidateKeys: [['shop-items']],
  });

  // Delete shop item mutation
  const deleteShopItemMutation = useApiMutation<
    { id: string },
    { success: boolean }
  >({
    endpoint: (variables) => ({
      path: `/shop-items/${variables.id}`,
      method: 'DELETE',
    }),
    invalidateKeys: [['shop-items']],
  });

  // Authentication checks
  if (auth0Loading || showLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-semibold text-gray-700">Loading...</h2>
          {isAuthPending && (
            <p className="text-gray-600 mt-2">Authenticating with server...</p>
          )}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            Not authenticated
          </h2>
          <p className="text-gray-600 mt-2">
            Please log in to access the shop.
          </p>
        </div>
      </div>
    );
  }

  const handlePurchase = async (item: BackendShopItem) => {
    if (points >= item.itemCost && !item.isOwned) {
      try {
        await purchaseMutation.mutateAsync({ id: item.id });
        setToast({
          message: `Purchased ${item.itemName}! 🎉`,
          type: 'success',
        });
      } catch (error: any) {
        console.error('Failed to purchase item:', error);
        setToast({
          message:
            error?.message || 'Failed to purchase item. Please try again.',
          type: 'error',
        });
      }
    }
  };

  const handleCreateShopItem = async (data: {
    itemName: string;
    itemType: string;
    itemColor: string;
    itemCost: number;
    itemDescription?: string;
  }) => {
    try {
      await createShopItemMutation.mutateAsync(data);
      setShowCreateForm(false);
      setToast({
        message: `Created shop item: ${data.itemName}! 🎉`,
        type: 'success',
      });
    } catch (error: any) {
      console.error('Failed to create shop item:', error);
      setToast({
        message:
          error?.message || 'Failed to create shop item. Please try again.',
        type: 'error',
      });
    }
  };

  const handleDeleteShopItem = (item: BackendShopItem) => {
    setConfirmModal({ item });
  };

  const confirmDelete = async () => {
    if (!confirmModal) return;

    try {
      await deleteShopItemMutation.mutateAsync({ id: confirmModal.item.id });
      setToast({
        message: `Deleted ${confirmModal.item.itemName} successfully.`,
        type: 'success',
      });
      setConfirmModal(null);
    } catch (error: any) {
      console.error('Failed to delete shop item:', error);
      setToast({
        message:
          error?.message || 'Failed to delete shop item. Please try again.',
        type: 'error',
      });
      setConfirmModal(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header
        activePage="shop"
        userPicture={auth0User?.picture}
        userName={auth0User?.name}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Shop 🛍️</h1>
              <p className="text-gray-600">
                Spend your points to customize your butterfly experience!
              </p>
            </div>
            <div className="flex items-stretch gap-4">
              <PointsDisplay points={points} className="h-auto" />
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors font-semibold"
              >
                <Plus className="w-4 h-4" />
                Create Item
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Section */}
        {shopItems && shopItems.filter((item) => item.isOwned).length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-green-600" />
              My Inventory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {shopItems
                .filter((item) => item.isOwned)
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 border-2 border-green-400"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md"
                        style={{ backgroundColor: item.itemColor }}
                      >
                        🦋
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        Owned
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-lg mb-1">
                      {item.itemName}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize mb-2">
                      {item.itemType}
                    </p>
                    {item.itemDescription && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.itemDescription}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Shop Items */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-purple-600" />
          Available Items
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopItems && shopItems.filter((item) => !item.isOwned).length > 0 ? (
            shopItems
              .filter((item) => !item.isOwned)
              .map((item) => {
              const canAfford = points >= item.itemCost;
              const isOwned = item.isOwned;

              return (
                <div
                  key={item.id}
                  className={`bg-white/80 backdrop-blur-sm rounded shadow-lg p-6 border-2 transition-all ${
                    isOwned
                      ? 'border-green-500 bg-green-50'
                      : canAfford
                        ? 'border-purple-300 hover:shadow-xl hover:scale-105'
                        : 'border-gray-200 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <ShoppingBag
                        className={`w-8 h-8 ${
                          isOwned ? 'text-green-500' : 'text-purple-500'
                        }`}
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {item.itemName}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {item.itemType}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isOwned && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          Owned
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteShopItem(item)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {item.itemDescription || 'No description available'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      <span className="text-2xl font-bold text-gray-800">
                        {item.itemCost}
                      </span>
                    </div>

                    {isOwned ? (
                      <div className="px-4 py-2 bg-green-100 text-green-800 rounded font-semibold">
                        Already Owned
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford}
                        className={`px-4 py-2 rounded font-semibold transition-colors ${
                          canAfford
                            ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Purchase' : 'Need More Points'}
                      </button>
                    )}
                  </div>

                  {!canAfford && !isOwned && (
                    <p className="text-sm text-gray-500 mt-2 text-right">
                      Need {item.itemCost - points} more points
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white rounded shadow-md p-12 text-center">
              <p className="text-xl text-gray-600">
                {shopItems && shopItems.length > 0
                  ? "You've purchased all available items! 🎉"
                  : 'No shop items available. Check back later!'}
              </p>
            </div>
          )}
        </div>

        {/* Create Shop Item Form */}
        {showCreateForm && (
          <ShopItemForm
            onSubmit={handleCreateShopItem}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Confirm Delete Modal */}
        <ConfirmModal
          isOpen={!!confirmModal}
          title="Delete Shop Item"
          message={`Are you sure you want to delete "${confirmModal?.item.itemName}"? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          type="danger"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmModal(null)}
        />
      </div>
    </div>
  );
}
