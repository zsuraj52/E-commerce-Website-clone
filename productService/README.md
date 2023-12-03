# Product Service

The Product Service is a fundamental backend component of the shopping website, responsible for managing various product-related functionalities. 
This service offers a wide range of features to create, update, retrieve, and delete products. 
Additionally, it facilitates interactions such as adding product reviews and ratings, filtering products by category, brand, price range, and 
other filter criteria. The Product Service also provides endpoints for handling popular and best-selling products, pagination of products, 
searching products using regular expressions, and updating product quantities and ratings.

This README file provides an overview of the features and functionalities available in the Product Service, including the API endpoints for 
performing different actions related to products.



## Follow these steps to run the Product Service project:

1. Run the following command to install the required dependencies:
    npm install
   
2. Setup the database settings inside the `data-source.ts` file. Replace the database connection details with your database configuration.

3. Run the following command to start the project
   npm start



After completing these steps, the Product Service will be up and running, and administrators and customers can utilize the various API endpoints 
to perform a wide range of actions related to products on the shopping website.


# NOTE:-
Please ensure that you have Node.js and npm (Node Package Manager) installed on your system before running the project. 
Additionally, configure the database settings appropriately to ensure proper database connectivity.




## Features and API Endpoints

1. **createProduct**: `POST /product/create` - Allows administrators to create new products and add them to the shopping website.

2. **addProductReview**: `POST /product/add/review` - Enables customers to add reviews for products they have purchased.

3. **addProductRating**: `POST /product/add/rating` - Allows customers to add ratings to products they have purchased.

4. **getProductByCategory**: `GET /product/category` - Retrieves products based on their categories.

5. **getProductsByBrand**: `GET /product/brand` - Fetches products based on their brands.

6. **getProductsByfilterData**: `GET /product/filter` - Retrieves products based on specific filter criteria.

7. **getProductByPriceRange**: `GET /product/price` - Fetches products within a given price range.

8. **getPopularProducts**: `GET /product/popular` - Retrieves popular products based on user interactions.

9. **getBestSellingProducts**: `GET /product/best/selling` - Fetches the best-selling products based on order data.

10. **getAllProductsByPagination**: `GET /product/products` - Fetches recently created products and handles pagination for products.

11. **getProductsByRegex**: `GET /product/regex` - Searches for products using regular expressions.

12. **getProduct**: `GET /product/id` - Retrieves product information based on its ID.

13. **getProductById**: `GET /product/:id` - Retrieves product information based on its unique identifier.

14. **getAllProducts**: `GET /product/admins` - Fetches all products for administrators.

15. **getProductByNameForOrderService**: `GET /product/get/name` - Retrieves product names for the Order Service.

16. **getProductByKeyword**: `GET /product/get/product` - Searches for products based on a given keyword.

17. **updateProduct**: `PUT /product/update` - Allows administrators to update product information.

18. **updateProducts**: `PUT /product/update/product` - Enables administrators to update multiple products at once.

19. **updateProductQuantity**: `PUT /product/update/quantity` - Allows administrators to update product quantities.

20. **updateProductRating**: `PUT /product/update/rating` - Enables administrators to update product ratings.

21. **deleteProduct**: `DELETE /product/delete` - Permanently removes a product from the shopping website.

## Steps to Run This Project



## Summary

The Product Service is a crucial backend component that facilitates efficient management of products on the shopping website. 
With an extensive set of features and API endpoints, administrators can create, update, and retrieve products easily. 
Customers can also interact with products by adding reviews, ratings, and searching for items based on various criteria. 
By providing such comprehensive functionalities, the Product Service contributes significantly to delivering a seamless and engaging 
shopping experience for both administrators and customers, ensuring successful e-commerce operations.
