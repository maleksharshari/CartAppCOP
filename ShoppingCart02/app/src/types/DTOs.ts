export interface ProductDto {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    reviews: string[];
}

export interface ReviewCreateDto {
    productId: string;
    userId: string;
    comment: string;
}

export interface UserDto {
    id: string;
    email: string;
    cart: string[]; // List of product IDs in the cart
    favorites: string[];
    // List of product IDs in the favorites
}

export interface CreateUserDto {
    id: string;
    email: string;
}

export interface ReviewDto {
    id: string;
    productId: string;
    userId: string;
    userEmail?: string;
    comment: string;
    createdAt: string;
}

export interface AddToCartOrFavDto {
    userId: string;
    productId: string;
}


// Default export for DTOs
const DTOs = {
    AddToCartOrFavDto: {} as AddToCartOrFavDto,
    ProductDto: {} as ProductDto,
    ReviewDto: {} as ReviewDto,
    ReviewCreateDto: {} as ReviewCreateDto,
    UserDto: {} as UserDto,
    CreateUserDto: {} as CreateUserDto
};

export default DTOs;
