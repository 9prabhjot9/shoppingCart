import { createContext, ReactNode, useContext, useState } from "react"
import { ShoppingCart } from "../components/ShoppingCart"
import { useLocalStorage } from "../hooks/useLocalStorage"


type ShoppingCartProviderProps ={
    children: ReactNode
}

type CartItem = {
    id: number
    quantity: number
}

type ShoppingCartContextType = {
    openCart: () => void
    closeCart: () => void
    getItemQuantity: (id: number) => number
    increaseQuantity: (id: number) => void
    decreaseQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    cartQuantity: number
    cartItems: CartItem[]
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined)

export const useShoppingCart = () => {
    const context = useContext(ShoppingCartContext)
    if (!context) {
        throw new Error("useShoppingCart must be used within a ShoppingCartProvider")
    }
    return context
}

export function ShopppingCartProvider({ children }:
ShoppingCartProviderProps){
    const [isOpen, setIsOpen] = useState(false)
    const [cartItems, setCartItems ] = useLocalStorage<CartItem[]>("shopping-cart", [])

    const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0)

    const openCart = () => setIsOpen(true)
    const closeCart = () => setIsOpen(false)

    function getItemQuantity(id: number){
        return cartItems.find(item => item.id === id)?.quantity || 0
    }

    function increaseQuantity(id: number){
        return setCartItems(currItems => {
            if (currItems.find(item => item.id === id) == null){
                return [...currItems, { id, quantity: 1}]
            } else {
                return currItems.map(item => {
                    if(item.id === id){
                        return { ...item, quantity: item.quantity + 1}
                    } else {
                        return item
                    }
                    
                })
            }
        })
    }

    function decreaseQuantity(id: number){
        return setCartItems(currItems => {
            if (currItems.find(item => item.id === id)?.quantity == null){
                    return currItems.filter(item=> item.id !== id)
            } else{
                return currItems.map(item => {
                    if(item.id === id){
                        return{...item, quantity: item.quantity - 1}
                    }else {
                        return item
                    }
                })
            }
        })
    }

    function removeFromCart(id: number){
        return setCartItems(currItems => {
            return currItems.filter(item => item.id !== id)
        })
    }
    return(
        <ShoppingCartContext.Provider value={{ getItemQuantity,
         increaseQuantity,
         decreaseQuantity, 
         removeFromCart,
         cartItems,
         cartQuantity,
         openCart,
         closeCart  
         }}
         >
            { children}
            <ShoppingCart isOpen={isOpen} />
        </ShoppingCartContext.Provider>
    )
}

