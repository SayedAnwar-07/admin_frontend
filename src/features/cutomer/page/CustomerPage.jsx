import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "@/components/shared/PageHeader";
import CustomerStats from "../components/CustomerStats";
import CustomerUserTable from "../components/CustomerUserTable";

import {
  fetchAllCustomers,
  deleteUserByAdmin,
  clearAdminError,
  clearAdminSuccessMessage,
} from "@/store/features/adminSlice";

export default function CustomerPage() {
  const dispatch = useDispatch();

  const {
    customers = [],
    customersLoading,
    deleteLoading,
    error,
    successMessage,
  } = useSelector((state) => state.admin || {});

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearAdminError());
      dispatch(clearAdminSuccessMessage());
    };
  }, [dispatch]);

  const handleDeleteCustomer = async (userId) => {
    const resultAction = await dispatch(deleteUserByAdmin(userId));

    if (deleteUserByAdmin.fulfilled.match(resultAction)) {
      dispatch(fetchAllCustomers());
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Management"
        subtitle="Manage and monitor all customers from the admin panel."
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

      <CustomerStats customers={customers} />

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Customer List</h2>
          <p className="text-sm text-muted-foreground">
            Full customer information for admin control.
          </p>
        </div>

        {customersLoading ? (
          <div className="rounded-2xl border border-border bg-background p-10 text-center text-sm text-muted-foreground shadow-sm">
            Loading customers...
          </div>
        ) : (
          <CustomerUserTable
            customers={customers}
            onDelete={handleDeleteCustomer}
            deleteLoading={deleteLoading}
          />
        )}
      </div>
    </div>
  );
}
