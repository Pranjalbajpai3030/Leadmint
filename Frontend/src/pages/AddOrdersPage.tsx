
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';

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
  
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<OrderForm>({
    defaultValues: {
      orderDate: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
    }
  });

  useEffect(() => {
    // Mock API call to fetch customers
    const fetchCustomers = () => {
      // In a real app, this would be an API call
      const mockCustomers: Customer[] = [
        { id: 'cust-001', name: 'John Doe', email: 'john@example.com' },
        { id: 'cust-002', name: 'Jane Smith', email: 'jane@example.com' },
        { id: 'cust-003', name: 'Robert Johnson', email: 'robert@example.com' },
        { id: 'cust-004', name: 'Emily Wilson', email: 'emily@example.com' },
        { id: 'cust-005', name: 'Michael Brown', email: 'michael@example.com' },
      ];
      
      setCustomers(mockCustomers);
      setLoading(false);
    };
    
    fetchCustomers();
  }, []);
  
  const onSubmit = (data: OrderForm) => {
    // In a real app, this would call the API endpoint
    console.log('Submitting order data:', data);
    
    // Mock API call
    toast.loading('Adding order...', { duration: 1500 });
    
    // Simulate successful API response
    setTimeout(() => {
      console.log('Order added with payload:', data);
      
      toast.success('Order added successfully!');
      reset({
        customerId: '',
        amount: 0,
        orderDate: new Date().toISOString().slice(0, 16),
      });
    }, 1500);
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
        <p className="text-gray-600">Record new customer orders in the system.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
          <CardDescription>Enter the details for the new order.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-group">
              <label htmlFor="customerId" className="input-label">Customer</label>
              <Controller
                name="customerId"
                control={control}
                rules={{ required: 'Customer is required' }}
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
              {errors.customerId && <span className="text-red-500 text-sm">{errors.customerId.message}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="amount" className="input-label">Amount ($)</label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                {...register('amount', { 
                  required: 'Amount is required',
                  valueAsNumber: true,
                  min: {
                    value: 0.01,
                    message: 'Amount must be greater than $0'
                  }
                })}
                placeholder="0.00"
              />
              {errors.amount && <span className="text-red-500 text-sm">{errors.amount.message}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="orderDate" className="input-label">Order Date</label>
              <Input
                id="orderDate"
                type="datetime-local"
                {...register('orderDate', { required: 'Order date is required' })}
              />
              {errors.orderDate && <span className="text-red-500 text-sm">{errors.orderDate.message}</span>}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => reset()}>
                Cancel
              </Button>
              <Button type="submit">
                Add Order
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddOrdersPage;
