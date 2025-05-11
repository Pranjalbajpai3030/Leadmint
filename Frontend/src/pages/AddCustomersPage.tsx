
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface CustomerForm {
  name: string;
  email: string;
  totalSpent: number;
  visitCount: number;
  lastActive: string;
}

const AddCustomersPage: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerForm>();
  
  const onSubmit = (data: CustomerForm) => {
    // In a real app, this would call the API endpoint
    console.log('Submitting customer data:', data);
    
    // Mock API call
    toast.loading('Adding customer...', { duration: 1500 });
    
    // Simulate successful API response after 1.5 seconds
    setTimeout(() => {
      console.log('Customer added with payload:', {
        userId: 'user123', // Would come from auth context in real app
        ...data
      });
      
      toast.success('Customer added successfully!');
      reset();
    }, 1500);
  };
  
  return (
    <div className="page-container max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Add Customers</h1>
        <p className="text-gray-600">Create new customer profiles in your CRM database.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>Enter the details for your new customer.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-group">
              <label htmlFor="name" className="input-label">Name</label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
                placeholder="John Doe"
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="input-label">Email</label>
              <Input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  }
                })}
                placeholder="john@example.com"
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="totalSpent" className="input-label">Total Spent ($)</label>
                <Input
                  id="totalSpent"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('totalSpent', { 
                    required: 'Total spent is required',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'Value cannot be negative'
                    }
                  })}
                  placeholder="0.00"
                />
                {errors.totalSpent && <span className="text-red-500 text-sm">{errors.totalSpent.message}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="visitCount" className="input-label">Visit Count</label>
                <Input
                  id="visitCount"
                  type="number"
                  min="0"
                  {...register('visitCount', { 
                    required: 'Visit count is required',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'Value cannot be negative'
                    }
                  })}
                  placeholder="0"
                />
                {errors.visitCount && <span className="text-red-500 text-sm">{errors.visitCount.message}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="lastActive" className="input-label">Last Active</label>
              <Input
                id="lastActive"
                type="datetime-local"
                {...register('lastActive', { required: 'Last active date is required' })}
              />
              {errors.lastActive && <span className="text-red-500 text-sm">{errors.lastActive.message}</span>}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => reset()}>
                Cancel
              </Button>
              <Button type="submit">
                Add Customer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCustomersPage;
