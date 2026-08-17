import { Trash2, Loader2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Alert from "@/components/shared/Alert";

export default function CustomerUserTable({
  customers = [],
  onDelete,
  deleteLoading,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      <div className="overflow-x-auto">
        <Table className="min-w-225">
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          customer.profile_image_url ||
                          "https://via.placeholder.com/44x44?text=User"
                        }
                        alt={customer.full_name || "User"}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">
                          {customer.full_name || "No name"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {customer.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{customer.email || "N/A"}</TableCell>
                  <TableCell>{customer.whatsapp_number || "N/A"}</TableCell>
                  <TableCell>{customer.service_area || "N/A"}</TableCell>
                  <TableCell className="capitalize">
                    {customer.role || "customer"}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        customer.is_verified
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {customer.is_verified ? "Verified" : "Unverified"}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <Alert
                      title="Delete customer?"
                      description={`Are you sure you want to delete ${
                        customer.full_name || "this customer"
                      }? This action cannot be undone.`}
                      cancelText="Cancel"
                      actionText="Delete"
                      onConfirm={() => onDelete(customer.id)}
                      disabled={deleteLoading}
                      actionClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </>
                        )}
                      </Button>
                    </Alert>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-muted-foreground"
                >
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
