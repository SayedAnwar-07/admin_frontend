import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "@/components/shared/PageHeader";
import SellerStats from "../components/SellerStats";
import SellerUserTable from "../components/SellerUserTable";

import {
  fetchAllSellers,
  deleteUserByAdmin,
  clearAdminError,
  clearAdminSuccessMessage,
} from "@/store/features/adminSlice";

export default function SellerPage() {
  const dispatch = useDispatch();

  const {
    sellers = [],
    sellersLoading,
    deleteLoading,
    error,
    successMessage,
  } = useSelector((state) => state.admin || {});

  useEffect(() => {
    dispatch(fetchAllSellers());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearAdminError());
      dispatch(clearAdminSuccessMessage());
    };
  }, [dispatch]);

  const handleDeleteSeller = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this seller?",
    );

    if (!confirmed) return;

    const resultAction = await dispatch(deleteUserByAdmin(userId));

    if (deleteUserByAdmin.fulfilled.match(resultAction)) {
      dispatch(fetchAllSellers());
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Seller Management"
        subtitle="Manage and monitor all sellers from the admin panel."
      />

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      ) : null}

      <SellerStats sellers={sellers} />

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Seller List</h2>
          <p className="text-sm text-muted-foreground">
            Full seller information for admin control.
          </p>
        </div>

        {sellersLoading ? (
          <div className="rounded-2xl border border-border bg-background p-10 text-center text-sm text-muted-foreground shadow-sm">
            Loading sellers...
          </div>
        ) : (
          <SellerUserTable
            sellers={sellers}
            onDelete={handleDeleteSeller}
            deleteLoading={deleteLoading}
          />
        )}
      </div>
    </div>
  );
}
