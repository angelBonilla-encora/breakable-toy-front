import { Product } from "@/products/models";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const inventoryApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    tagTypes:["Products","Categories","Metrics"],
    endpoints: (build) => ({
        //Products
        getProducts: build.query({
            query: ({page = 0, name, category = [], availability, sort}) => {
                const params = new URLSearchParams();
                if(name) params.append("name", name);
                if(availability) params.append("availability", availability);
                if(sort) params.append("sort", sort);
                if(page) params.append("page", page);

                category.forEach((cat : string)=>params.append("category",cat))
                return {
                    url: "/products",
                    params,
                }
            },
            providesTags:["Products"],

        }),
        getProduct: build.query({
            query: (productId: string) => `/products/${productId}`,
        }),
        createProduct: build.mutation<Product, Product>({
            query: (newProduct: Product) => ({
                url: "/products",
                method: "POST",
                body: newProduct,
            }),
            invalidatesTags:["Products"]

        }),
        updateProduct: build.mutation<Product, { productId: string, updatedProduct: Product }>({
            query: ({ productId, updatedProduct }) => ({
                url: `/products/${productId}`,
                method: "PUT",
                body: updatedProduct,
            }),
            invalidatesTags:["Products"]

        }),
        deleteProduct: build.mutation<void, string>({
            query: (productId: string) => ({
                url: `/products/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags:["Products"]
        }),
        markProductOutOfStock : build.mutation({
            query: (productId: string) => ({
                url: `/products/${productId}/outofstock`,
                method: "POST",
            }),
            invalidatesTags:["Products","Metrics"]
        }),
        restoreProductStock : build.mutation({
            query: (productId: string) => ({
                url: `/products/${productId}/instock`,
                method: "PUT",
            }),
            invalidatesTags:["Products","Metrics"]
        }),

        //Categories
        getCategories: build.query({
            query: () => "/categories",
            providesTags:["Categories"]
        }),
      
        createCategory: build.mutation({
            query: (Category: {name:string}) => ({
                url: "/categories",
                method: "POST",
                body: Category,
            }),
            invalidatesTags:["Categories"]
        }),
        getMetrics: build.query({
            query: () => "/categories/metrics",
            providesTags:["Metrics"],
        }),

    }),
});

export const { 
    useGetProductsQuery,
    useGetProductQuery, 
    useCreateProductMutation, 
    useUpdateProductMutation, 
    useDeleteProductMutation, 
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useGetMetricsQuery,
    useMarkProductOutOfStockMutation,
    useRestoreProductStockMutation
} = inventoryApi;