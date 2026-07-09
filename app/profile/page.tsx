"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  LogOut,
  Package,
  Heart,
  Settings,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import { useAuth } from "../../contexts/AuthContext";
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress } from "../../hooks/use-addresses";
import { Address } from "@/lib/types";
import { toast } from "sonner";
import LogoutLoader from "@/components/LogoutLoader";

const ProfilePage = () => {
  const { user, updateProfile, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
    bio: user?.bio || "",
  });

  const { data: addresses = [], isLoading: addressesLoading } = useAddresses();
  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();

  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    country: "",
    division: "",
    district: "",
    area: "",
    addressLine: "",
    postalCode: "",
    isDefault: false,
  });

  if (!isAuthenticated && !isLoggingOut) {
    router.push("/login");
    return null;
  }

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast.success("Profile updated", {
      description: "Your changes have been saved successfully.",
    });
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    toast.success("Logged out", {
      description: "You've been successfully logged out.",
    });
    // Keep the page mounted (and footer in place) while the loader shows,
    // then redirect home so the layout doesn't collapse.
    setTimeout(() => {
      router.push("/");
    }, 900);
  };

  const openAddressDialog = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setAddressForm({
        name: address.name,
        phone: address.phone,
        country: address.country || "",
        division: address.division || "",
        district: address.district,
        area: address.area || "",
        addressLine: address.addressLine,
        postalCode: address.postalCode || "",
        isDefault: address.isDefault,
      });
    } else {
      setEditingAddress(null);
      setAddressForm({
        name: user?.name || "",
        phone: user?.phone || "",
        country: "",
        division: "",
        district: "",
        area: "",
        addressLine: "",
        postalCode: "",
        isDefault: false,
      });
    }
    setIsAddressDialogOpen(true);
  };

  const handleAddressSubmit = async () => {
    try {
      if (editingAddress) {
        await updateAddressMutation.mutateAsync({
          id: editingAddress.id,
          data: addressForm,
        });
      } else {
        await createAddressMutation.mutateAsync(addressForm);
      }
      setIsAddressDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save address");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddressMutation.mutateAsync(id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete address");
    }
  };

  const menuItems = [
    { icon: Package, label: "My Orders", href: "/orders" },
    { icon: Heart, label: "Wishlist", href: "#wishlist" },
    { icon: Settings, label: "Settings", href: "#settings" },
  ];

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            {/* Profile Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl shadow-slate-200/80 mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-white rounded-3xl pointer-events-none" />

              <div className="relative p-8 lg:p-10">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="w-24 h-24 lg:w-32 lg:h-32 border-4 border-violet-200 shadow-lg">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-3xl lg:text-4xl font-display text-violet-700 bg-violet-50">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <h1 className="font-display text-2xl lg:text-4xl font-bold text-slate-900 mb-1 tracking-tight">
                      {user?.name}
                    </h1>
                    <p className="text-slate-500 text-base lg:text-lg mb-3">
                      {user?.email}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-medium">
                        <User className="w-3.5 h-3.5" />
                        Member
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium">
                        <Mail className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 shrink-0">
                    {isEditing ? (
                      <Button
                        onClick={handleSave}
                        className="active:scale-95 transition-transform bg-orange-500 hover:bg-orange-600 text-white border border-orange-500/20 shadow-lg shadow-orange-100"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="active:scale-95 transition-transform bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Quick Nav */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
                >
                  <nav className="space-y-2">
                    {menuItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-all group"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-violet-100 transition-colors">
                          <item.icon className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition-colors" />
                        </div>
                        <span className="font-medium text-sm">{item.label}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                      </Link>
                    ))}
                    <div className="pt-2 mt-2 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all w-full"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50">
                          <LogOut className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-sm">Logout</span>
                      </button>
                    </div>
                  </nav>
                </motion.div>
              </div>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 space-y-8"
              >
                {/* Personal Information */}
                <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-semibold text-slate-900">
                      Personal Information
                    </h2>
                    {!isEditing && (
                      <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Read Only</span>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700 text-sm font-medium">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          disabled={!isEditing}
                          className="pl-10 bg-white border-slate-200 text-slate-900 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700 text-sm font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          disabled={!isEditing}
                          className="pl-10 bg-white border-slate-200 text-slate-900 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-slate-700 text-sm font-medium">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Add phone number"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          disabled={!isEditing}
                          className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-slate-700 text-sm font-medium">City</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="city"
                          placeholder="Add city"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          disabled={!isEditing}
                          className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="address" className="text-slate-700 text-sm font-medium">Address</Label>
                      <Input
                        id="address"
                        placeholder="Add your address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        disabled={!isEditing}
                        className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="bio" className="text-slate-700 text-sm font-medium">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        disabled={!isEditing}
                        rows={4}
                        className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Saved Addresses */}
                <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-semibold text-slate-900">
                      Saved Addresses
                    </h2>
                    <Button
                      size="sm"
                      onClick={() => openAddressDialog()}
                      className="active:scale-95 transition-transform bg-orange-500 hover:bg-orange-600 text-white border border-orange-500/20 shadow-lg shadow-orange-100"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Address
                    </Button>
                  </div>

                  {addressesLoading ? (
                    <div className="space-y-3">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-6 bg-slate-200 rounded w-1/3 mb-2" />
                          <div className="h-4 bg-slate-100 rounded w-2/3" />
                        </div>
                      ))}
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-12 rounded-xl border-2 border-dashed border-slate-200">
                      <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 mb-1">No saved addresses yet</p>
                      <p className="text-sm text-slate-400">Add an address for faster checkout</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <motion.div
                          key={addr.id}
                          whileHover={{ y: -2 }}
                          className="relative p-5 rounded-2xl border border-slate-200 bg-white hover:border-violet-200 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50 text-violet-700">
                                <MapPin className="w-4 h-4" />
                              </div>
                              <p className="font-semibold text-slate-900">{addr.name}</p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openAddressDialog(addr)}
                                className="h-8 w-8 border border-slate-200 hover:bg-violet-50 hover:text-violet-700"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteAddress(addr.id)}
                                disabled={deleteAddressMutation.isPending}
                                className="h-8 w-8 border border-slate-200 hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm text-slate-500">
                            <p>{addr.addressLine}</p>
                            <p>
                              {addr.district}
                              {addr.area && `, ${addr.area}`}
                            </p>
                            {addr.country && (
                              <p>
                                {addr.country}
                                {addr.postalCode && ` ${addr.postalCode}`}
                              </p>
                            )}
                            <p className="text-slate-400">Phone: {addr.phone}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Address Dialog */}

      {isLoggingOut && <LogoutLoader />}
    </div>
  );
};

export default ProfilePage;
