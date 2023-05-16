
type Product = {
  id: number,
  title: string,
  published_at: date
};

type Customer = {
  id: number,
  email: string
}

type CustomerData = {
  customer: Customer,
  total_spent: number
};

export interface Brief {
  new_products: Product[];
  top_customers: {
    total_spent: number;
    top_customers: CustomerData[];
  };
  high_interest_products: {
    quantity: number;
    products: Product[];
  };
}
