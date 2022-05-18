let btn_addto_cart = document.querySelectorAll('.btn-addto-cart');

for (let i = 0; i < btn_addto_cart.length; i++) {
    btn_addto_cart[i].addEventListener('click', addToCartProdCard);
}

function setLSData(data, item) {
    let localData = JSON.parse(localStorage.getItem('cart'));
    // let newData = data;

    if (!localData || localData.length === 0) {
        data.push(item);
        console.log('nai')
        localStorage.setItem('cart', JSON.stringify(data));
        // window.location.reload();
    } else {
        console.log('ache')
        localData.map(function(localItem, index) {
            if (localItem.productId == item.productId) {
                item.count = parseInt(localItem.count) + 1;
                item.price = parseInt(localItem.price) + parseInt(item.price);
                // newData.push(item);
                console.log('same')
            } else {
                data.push(localItem);
                console.log('localItem', localItem)
                console.log('data', data)
            }
        });
        data.push(item);
        localStorage.setItem('cart', JSON.stringify(data));
        // window.location.reload();
    }

    return !!JSON.parse(localStorage.getItem('cart'));
}

function renderMiniCart() {
    let localData = JSON.parse(localStorage.getItem('cart'));
    let cartItems = '';
    let cartCount = 0;
    let cartTotalPrice = 0;

    if (!!localData && localData.length > 0) {

        localData.map(function(localItem, index) {
            cartItems += '<li class="item" data-product-id="' + localItem.productId + '" data-unit-price="' + localItem.unit_price + '">';
            cartItems += '<a class="product-image" href="#"><img src="' + localItem.img + '" /></a>';
            cartItems += '        <a class="pName" href="cart.html">' + localItem.name + '</a>';
            cartItems += '               <div class="wrapQtyBtn">';
            cartItems += '            <div class="qtyField">';
            cartItems += '                <span class="label">Qty:</span>';
            cartItems += '               <a class="qtyBtn qtyminus minus" href="javascript:void(0);"><i class="fa anm anm-minus-r" aria-hidden="true"></i></a>';
            cartItems += '               <input type="text" id="Quantity" name="quantity" value="' + localItem.count + '" class="product-form__input qty">';
            cartItems += '               <a class="qtyBtn qtyplus plus" href="javascript:void(0);"><i class="fa anm anm-plus-r" aria-hidden="true"></i></a>';
            cartItems += '           </div>';
            cartItems += '       </div>';
            cartItems += '     <div class="priceRow">';
            cartItems += '             <div class="product-price">';
            cartItems += '                 <span class="money">$' + localItem.price + '</span>';
            cartItems += '            </div>';
            cartItems += '         </div>';
            cartItems += '    </div>';
            cartItems += ' </li>';
            cartCount = cartCount + parseInt(localItem.count);
            cartTotalPrice += parseInt(localItem.unit_price) * parseInt(localItem.count);
        })

    } else {
        cartItems += '<h3 class="text-center">Empty Cart</h3>';
    }


    $('#CartCount').html(cartCount);
    $('.mini-products-list').html(cartItems);
    $('#cartTotal').html('$' + cartTotalPrice);


    $('.qtyplus').each(function(i, elm) {
        // console.log(elm)
        $(elm).on('click', function() {
            let data = [];
            let qty = $(this).siblings('input');
            let cartItem = $(this).closest('.item');
            qty.val(function(i, oldval) {
                return parseInt(oldval, 10) + 1;

            });
            localData.map(function(localItem, index) {
                if (
                    localItem.productId == parseInt(cartItem.data('product-id'))
                ) {
                    localItem.count = qty.val();
                    localItem.price = parseInt(localItem.count) * parseInt(cartItem.data('unit-price'));

                }
                data.push(localItem);
            })
            localStorage.setItem('cart', JSON.stringify(data));

            renderMiniCart();
        })
    })
    $('.qtyminus').each(function(i, elm) {
        // console.log(elm)
        $(elm).on('click', function() {
            let data = [];
            let qty = $(this).siblings('input');
            let cartItem = $(this).closest('.item');
            qty.val(function(i, oldval) {
                oldval = parseInt(oldval, 10);
                return (oldval - 1) > 0 ? oldval - 1 : 1;
            });
            localData.map(function(localItem, index) {
                if (
                    localItem.productId == cartItem.data('product-id') &&
                    qty.val() > 0 && localItem.price > localItem.unit_price
                ) {
                    localItem.count = qty.val();
                    localItem.price = localItem.price - cartItem.data('unit-price');
                }
                data.push(localItem);
            })
            localStorage.setItem('cart', JSON.stringify(data));
            renderMiniCart();
            // console.log(cartItem.find('.cart-item-size')[0].innerText);
        })
    })

    // Remove Item From Header Mini Cart
    // If Need this block of code just uncomment and modify however u need

    // $('.remove-cart-item').each(function(i, elm) {
    //     $(elm).on('click', function(e) {
    //         e.preventDefault();
    //         console.log('deleted')
    //         let data = [];
    //         let cartItem = $(this).closest('.single-cart-item');
    //         localData.map(function(localItem, index) {
    //                 if (
    //                     localItem.productId !== cartItem.data('product-id') ||
    //                     (localItem.productId == cartItem.data('product-id') &&
    //                         localItem.size != cartItem.find('.cart-item-size')[0].innerText)
    //                 ) {
    //                     console.log(localItem.size, cartItem.find('.cart-item-size')[0].innerText);
    //                     data.push(localItem);
    //                 }
    //             })
    //             // console.log(localItem.productId == cartItem.data('product-id') &&
    //             // localItem.size != cartItem.find('.cart-item-size')[0].innerText)
    //         localStorage.setItem('cart', JSON.stringify(data));
    //         renderMiniCart();
    //     })
    // })

}

function cartList() {
    return JSON.parse(localStorage.getItem('cart'));
}

function cartTotalCount() {
    let items = cartList();
    let count = 0;
    items.map(function(item) {
        // console.log(i);
        count = count + parseInt(item.count);
    })
    return count;
}

function cartTotalPrice() {
    let items = cartList();
    let price = 0;
    items.map(function(item) {
        // console.log(i);
        price = price + parseInt(item.price);
    })
    return price;
}

function addToCartProdCard(e) {

    e.stopPropagation();
    let items = [];
    let btn = e.target;
    let btn_parent = btn.parentElement;

    let name = btn_parent.children[1].value;
    let price = btn_parent.children[2].value;
    let productId = btn_parent.children[3].value;
    let img = btn_parent.children[0].src;
    let count = 1;

    let item = {
        'productId': parseInt(productId),
        'name': name,
        'count': parseInt(count),
        'price': parseInt(price),
        'img': img,
        'unit_price': parseInt(price),
    }

    if (!$.isEmptyObject(item)) {
        // items.push(item);
        // console.log(JSON.stringify(items));
        setLSData(items, item);
        renderMiniCart();
        // localStorage.setItem('cart', JSON.stringify(items));
    }
}

function renderBigCart(cartSelector, subtotalSelector, shippingSelector, totalSelector) {
    const cart = document.querySelector(cartSelector);
    const subtotal = document.querySelector(subtotalSelector);
    const shippingCharge = document.querySelector(shippingSelector);
    const total = document.querySelector(totalSelector);
    // console.log('cart', cart);
    let items = cartList();
    // console.log('items', items);
    if (!!items && items.length > 0) {
        cart.innerHTML = items.map((item) => `
            <tr class="cart__row border-bottom line1 cart-flex border-top item" data-product-id="${item.productId}" data-unit-price="${item.unit_price}">
            <td class="cart__image-wrapper cart-flex-item"><a href="#"><img class="cart__image" src="${item.img}" alt="${item.name}"></a></td>
            <td class="cart__meta small--text-left cart-flex-item"><div class="list-view-item__title"><a href="#">${item.name}</a></div></td>
            <td class="cart__price-wrapper cart-flex-item"><span class="money">${item.unit_price}</span></td>
            <td class="cart__update-wrapper cart-flex-item text-right">
                <div class="cart__qty text-center">
                    <div class="qtyField">
                        <a class="qtyBtn cartqtyminus minus" href="javascript:void(0);"><i class="icon icon-minus"></i></a>
                        <input class="cart__qty-input qty" type="text" name="quantity${item.productId}" id="qty" value="${item.count}" pattern="[0-9]*">
                        <a class="qtyBtn cartqtyplus plus" href="javascript:void(0);"><i class="icon icon-plus"></i></a>
                    </div>
                </div>
            </td>
            <td class="text-right small--hide cart-price"><div><span class="money">${item.price}</span></div></td>
            <td class="text-center small--hide"><a href="#" class="btn btn--secondary cart__remove remove-item " title="Remove tem"><i class="icon icon anm anm-times-l"></i></a></td>
            </tr>`).join("")
    } else {
        cart.innerHTML = `<tr class="single-big-cart-item"}"><td colspan="7"><h3 class="text-center">Empty Cart</h3></td></tr>`
    }

    subtotal.innerHTML = cartTotalPrice();
    // total.innerHTML = cartTotalPrice() + parseInt(shippingCharge.innerText);

    $('.cartqtyplus').each(function(i, elm) {
        // console.log(elm)
        $(elm).on('click', function() {
            let data = [];
            let qty = $(this).siblings('input');
            let cartItem = $(this).closest('.item');
            qty.val(function(i, oldval) {
                return parseInt(oldval, 10) + 1;
            });
            let items = cartList();
            items.map(function(localItem, index) {
                if (
                    localItem.productId == cartItem.data('product-id')
                ) {
                    localItem.count = qty.val();
                    localItem.price = parseInt(localItem.count) * parseInt(cartItem.data('unit-price'));


                }
                data.push(localItem);
            })
            localStorage.setItem('cart', JSON.stringify(data));
            renderMiniCart();
            renderBigCart(cartSelector, subtotalSelector, '.shipping-charge', '.total-price');
            // console.log(cartItem.find('.pro-size')[0].innerText);
        })
    })

    $('.cartqtyminus').each(function(i, elm) {
        // console.log(elm)
        $(elm).on('click', function() {
            let data = [];
            let qty = $(this).siblings('input');
            let cartItem = $(this).closest('.item');
            qty.val(function(i, oldval) {
                oldval = parseInt(oldval, 10);
                return (oldval - 1) > 0 ? oldval - 1 : 1;
            });
            let items = cartList();
            items.map(function(localItem, index) {
                if (
                    localItem.productId == cartItem.data('product-id') &&
                    qty.val() > 0 && localItem.price > localItem.unit_price
                ) {
                    localItem.count = qty.val();
                    localItem.price = parseInt(localItem.price) - parseInt(cartItem.data('unit-price'));

                }
                data.push(localItem);
            })
            localStorage.setItem('cart', JSON.stringify(data));
            renderMiniCart();
            renderBigCart(cartSelector, subtotalSelector, '.shipping-charge', '.total-price');
            // console.log(cartItem.find('.pro-size')[0].innerText);
        })
    })

    $('.remove-item').each(function(i, elm) {
        $(elm).on('click', function(e) {
            // alert('clicked');
            e.preventDefault();
            let data = [];
            let cartItem = $(this).closest('.item');

            let items = cartList();
            items.map(function(localItem, index) {
                    if (localItem.productId == cartItem.data('product-id')) {
                        // console.log(localItem.size, cartItem.find('.pro-size')[0].innerText);
                        if (index == 0) {
                            localStorage.clear('cart');
                        } else {
                            data.push(localItem); // update the cart
                        }
                    }
                })
                // console.log(localItem.productId == cartItem.data('product-id') &&
                // localItem.size != cartItem.find('.pro-size')[0].innerText)
            localStorage.setItem('cart', JSON.stringify(data));
            renderMiniCart();
            renderBigCart(cartSelector, subtotalSelector, '.shipping-charge', '.total-price');
        })
    })
}


renderMiniCart();
renderBigCart('#CartBody', '#Subtotal');