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
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user, updateProfile, logout, isAuthenticated } = useAuth();
  const router = useRouter();
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

  if (!isAuthenticated) {
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
    logout();
    toast.success("Logged out", {
      description: "You've been successfully logged out.",
    });
    router.push("/");
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-primary/20">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-xl sm:text-2xl font-display">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                    {user?.name}
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  <Button
                    onClick={handleSave}
                    className="active:scale-95 transition-transform"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="active:scale-95 transition-transform"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-destructive hover:text-destructive active:scale-95 transition-transform"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-xl p-4 shadow-warm"
                >
                  <nav className="space-y-1">
                    {menuItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center justify-between p-3 rounded-lg text-foreground hover:bg-muted transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </Link>
                    ))}
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
                <div className="bg-card rounded-xl p-6 shadow-warm">
                  <h2 className="font-display text-xl font-semibold mb-6">
                    Personal Information
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Add phone number"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="city"
                          placeholder="Add city"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Add your address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        disabled={!isEditing}
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                {/* Saved Addresses */}
                <div className="bg-card rounded-xl p-6 shadow-warm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-semibold">
                      Saved Addresses
                    </h2>
                    <Button
                      size="sm"
                      onClick={() => openAddressDialog()}
                      className="active:scale-95 transition-transform"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Address
                    </Button>
                  </div>

                  {addressesLoading ? (
                    <p className="text-muted-foreground">Loading addresses...</p>
                  ) : addresses.length === 0 ? (
                    <p className="text-muted-foreground">
                      No saved addresses. Add one for faster checkout.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className="flex items-start justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{addr.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {addr.addressLine}
                            </p>
                            <p className="text-sm text-muted-foreground">
                               {addr.district}
                               {addr.area && `, ${addr.area}`}
                             </p>
                             {addr.country && (
                               <p className="text-sm text-muted-foreground">
                                 {addr.country}
                                 {addr.postalCode && ` ${addr.postalCode}`}
                               </p>
                             )}
                            <p className="text-sm text-muted-foreground">
                              Phone: {addr.phone}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openAddressDialog(addr)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteAddress(addr.id)}
                              disabled={deleteAddressMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
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
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription>
              {editingAddress
                ? "Update your delivery address details."
                : "Add a new delivery address for faster checkout."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid sm:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="addr-name">Full Name</Label>
              <Input
                id="addr-name"
                value={addressForm.name}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addr-phone">Phone</Label>
              <Input
                id="addr-phone"
                value={addressForm.phone}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, phone: e.target.value })
                }
                required
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="addr-line">Address Line</Label>
              <Input
                id="addr-line"
                value={addressForm.addressLine}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, addressLine: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addr-area">Area / City</Label>
              <Input
                id="addr-area"
                value={addressForm.area}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, area: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addr-district">District</Label>
              <Input
                id="addr-district"
                value={addressForm.district}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, district: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addr-division">Division</Label>
              <Input
                id="addr-division"
                value={addressForm.division}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, division: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addr-country">Country</Label>
              <Input
                id="addr-country"
                value={addressForm.country}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, country: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addr-postal">Postal Code</Label>
              <Input
                id="addr-postal"
                value={addressForm.postalCode}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, postalCode: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddressDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddressSubmit}
              disabled={
                createAddressMutation.isPending || updateAddressMutation.isPending
              }
            >
              {editingAddress ? "Update" : "Save"} Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProfilePage;
