import { useEffect, useState } from "react"
import { useCart } from "../context/CartContext"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import { ShoppingCart, Trash2, Plus, Minus, Heart, Sparkles, ArrowRight, Package, CreditCard } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"

const Cart = () => {
  const { cartItems, removeFromCart, fetchCartItems, updateQuantity } = useCart([])
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadCart = async () => {
      await fetchCartItems()
      setLoading(false)
    }
    loadCart()
  }, [])

  const handleCheckout = async () => {
    setCheckoutLoading(true)
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        toast.info("Please login to proceed with checkout")
        navigate("/login")
        return
      }

      const response = await API.post("/api/orders")
      if (response.status === 200) {
        toast.success("Order placed successfully! 🎉")
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handleQuantityChange = (itemId, change) => {
    const item = cartItems.find((item) => item._id === itemId)
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change)
      updateQuantity(itemId, newQuantity)
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0)
  }

  const getItemTypeIcon = (type) => {
    switch (type) {
      case "venue":
        return "🏰"
      case "dish":
        return "🍽️"
      case "decoration":
        return "🌸"
      default:
        return "📦"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-100 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Loading your cart...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-100 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Your Wedding Cart
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Review your selected items and proceed to create your perfect wedding day
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {cartItems.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-gray-200 to-purple-200 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Start building your dream wedding by adding venues, dishes, and decorations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/venues")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Browse Venues
                </button>
                <button
                  onClick={() => navigate("/dishes")}
                  className="bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Explore Dishes
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <motion.div
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Package className="w-6 h-6 mr-2 text-purple-600" />
                        Cart Items ({cartItems.length})
                      </h2>
                      <span className="text-sm text-gray-500">Swipe on mobile for actions</span>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    <AnimatePresence>
                      {cartItems.map((item, index) => (
                        <motion.div
                          key={item._id}
                          className="p-6 hover:bg-purple-50/50 transition-all duration-300"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ delay: index * 0.1, duration: 0.4 }}
                          layout
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            {/* Item Image */}
                            <div className="relative group">
                              <img
                                src={item.image || "/placeholder.svg?height=100&width=100"}
                                alt={item.name}
                                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                {getItemTypeIcon(item.type)}
                              </div>
                            </div>

                            {/* Item Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="mb-2 sm:mb-0">
                                  <h3 className="text-lg font-bold text-gray-800 truncate">{item.name}</h3>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-sm text-gray-500 capitalize">{item.type}</span>
                                    {item.category && (
                                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                                        {item.category}
                                      </span>
                                    )}
                                  </div>
                                  {item.price > 0 && (
                                    <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-1">
                                      ${(item.price * item.quantity).toLocaleString()}
                                    </p>
                                  )}
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center bg-gray-100 rounded-xl p-1">
                                    <button
                                      onClick={() => handleQuantityChange(item._id, -1)}
                                      className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                                      disabled={item.quantity <= 1}
                                    >
                                      <Minus className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <span className="mx-3 font-semibold text-gray-800 min-w-[2rem] text-center">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => handleQuantityChange(item._id, 1)}
                                      className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                                    >
                                      <Plus className="w-4 h-4 text-gray-600" />
                                    </button>
                                  </div>

                                  {/* Remove Button */}
                                  <button
                                    onClick={() => {
                                      removeFromCart(item._id)
                                      toast.success("Item removed from cart")
                                    }}
                                    className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 group"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform duration-200" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 sticky top-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <CreditCard className="w-6 h-6 mr-2 text-purple-600" />
                    Order Summary
                  </h3>

                  {/* Order Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Items ({cartItems.length})</span>
                      <span className="font-semibold text-gray-800">${calculateTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Service Fee</span>
                      <span className="font-semibold text-gray-800">$0</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-t-2 border-purple-200">
                      <span className="text-xl font-bold text-gray-800">Total</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ${calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Item Breakdown */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Items Breakdown:</h4>
                    <div className="space-y-2">
                      {["venue", "dish", "decoration"].map((type) => {
                        const typeItems = cartItems.filter((item) => item.type === type)
                        if (typeItems.length === 0) return null
                        return (
                          <div key={type} className="flex justify-between text-sm">
                            <span className="text-gray-600 capitalize flex items-center">
                              <span className="mr-2">{getItemTypeIcon(type)}</span>
                              {type}s ({typeItems.length})
                            </span>
                            <span className="font-medium text-gray-800">
                              ${typeItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading || cartItems.length === 0}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {checkoutLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Proceed to Checkout</span>
                        <ArrowRight className="w-5 h-5" />
                        <Sparkles className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {/* Continue Shopping */}
                  <button
                    onClick={() => navigate("/")}
                    className="w-full mt-4 bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Continue Shopping
                  </button>

                  {/* Security Badge */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                    <div className="flex items-center justify-center space-x-2 text-green-700">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-medium">Secure & Trusted Checkout</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart
