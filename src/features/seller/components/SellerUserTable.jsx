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

export default function SellerUserTable({
  sellers = [],
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
            {sellers.length > 0 ? (
              sellers.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          seller.profile_image_url ||
                          "https://via.placeholder.com/44x44?text=User"
                        }
                        alt={seller.full_name || "User"}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">
                          {seller.full_name || "No name"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {seller.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{seller.email || "N/A"}</TableCell>
                  <TableCell>{seller.whatsapp_number || "N/A"}</TableCell>
                  <TableCell>{seller.service_area || "N/A"}</TableCell>
                  <TableCell className="capitalize">
                    {seller.role || "seller"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        seller.is_verified
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {seller.is_verified ? "Verified" : "Unverified"}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <Alert
                      title="Delete seller?"
                      description="This seller will be permanently deleted. This action cannot be undone."
                      cancelText="No, cancel"
                      actionText="Yes, delete"
                      onConfirm={() => onDelete(seller.id)}
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
                  No sellers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
