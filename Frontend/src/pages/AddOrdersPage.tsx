import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";

interface OrderForm {
  customerId: string;
  amount: number;
  orderDate: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

const AddOrdersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderForm>({
    defaultValues: {
      orderDate: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
    },
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "https://customer-relationship-management-pi.vercel.app/api/customers/details"
        );
        const customerData = response.data.map((customer: any) => ({
          id: customer.id.toString(),
          name: customer.name,
          email: customer.email,
        }));
        setCustomers(customerData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to fetch customers. Please try again.");
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const onSubmit = async (data: OrderForm) => {
    const toastID = toast.loading("Adding order...");
    try {
      const payload = {
        customer_id: parseInt(data.customerId, 10),
        amount: data.amount,
        order_date: data.orderDate,
      };

      const response = await axios.post(
        "https://customer-relationship-management-pi.vercel.app/api/orders/",
        payload
      );

      console.log("Order added successfully:", response.data);
      toast.dismiss(toastID);
      toast.success("Order added successfully!");
      reset({
        customerId: "",
        amount: 0,
        orderDate: new Date().toISOString().slice(0, 16),
      });
    } catch (error) {
      console.error("Error adding order:", error);
      toast.error("Failed to add order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-4 w-36 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Add Orders</h1>
        <p className="text-gray-600">
          Record new customer orders in the system.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
          <CardDescription>
            Enter the details for the new order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-group">
              <label htmlFor="customerId" className="input-label">
                Customer
              </label>
              <Controller
                name="customerId"
                control={control}
                rules={{ required: "Customer is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="form-input">
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} ({customer.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.customerId && (
                <span className="text-red-500 text-sm">
                  {errors.customerId.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="amount" className="input-label">
                Amount ($)
              </label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                {...register("amount", {
                  required: "Amount is required",
                  valueAsNumber: true,
                  min: {
                    value: 0.01,
                    message: "Amount must be greater than $0",
                  },
                })}
                placeholder="0.00"
              />
              {errors.amount && (
                <span className="text-red-500 text-sm">
                  {errors.amount.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="orderDate" className="input-label">
                Order Date
              </label>
              <Input
                id="orderDate"
                type="datetime-local"
                {...register("orderDate", {
                  required: "Order date is required",
                })}
              />
              {errors.orderDate && (
                <span className="text-red-500 text-sm">
                  {errors.orderDate.message}
                </span>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => reset()}>
                Cancel
              </Button>
              <Button type="submit">Add Order</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddOrdersPage;
