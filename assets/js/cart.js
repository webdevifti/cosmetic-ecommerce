let btn_addto_cart = document.querySelectorAll('.btn-addto-cart');

for(let i = 0; i< btn_addto_cart.length; i++){
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
                item.count = localItem.count + 1;
                item.price = parseInt(localItem.price);
                item.qty = parseInt(localItem.qty) + 1;
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
            cartItems += '<li class="item">';
            cartItems += '<a class="product-image" href="#"><img src="' +localItem.img+ '" /></a>';
            cartItems += '        <a class="pName" href="cart.html">'+localItem.name+'</a>';
            cartItems += '               <div class="wrapQtyBtn">';
            cartItems += '            <div class="qtyField">';
            cartItems += '                <span class="label">Qty:</span>';
            cartItems += '               <a class="qtyBtn minus" href="javascript:void(0);"><i class="fa anm anm-minus-r" aria-hidden="true"></i></a>';
            cartItems += '               <input type="text" id="Quantity" name="quantity" value="'+localItem.qty+ '" class="product-form__input qty">';
            cartItems += '               <a class="qtyBtn plus" href="javascript:void(0);"><i class="fa anm anm-plus-r" aria-hidden="true"></i></a>';
            cartItems += '           </div>';
            cartItems += '       </div>';
            cartItems += '     <div class="priceRow">';
            cartItems += '             <div class="product-price">';
            cartItems += '                 <span class="money">$'+localItem.price * localItem.qty+'</span>';
            cartItems += '            </div>';
            cartItems += '         </div>';
            cartItems += '    </div>';
            cartItems += ' </li>';
            cartCount = cartCount + parseInt(localItem.count);
            cartTotalPrice += localItem.price * localItem.qty;
        })

    } else {
        cartItems += '<h3 class="text-center">Empty Cart</h3>';
    }


    $('#CartCount').html(cartCount);
    $('.mini-products-list').html(cartItems);
    $('#cartTotal').html('$'+cartTotalPrice);


    $('.qtyplus').each(function(i, elm) {
        // console.log(elm)
        $(elm).on('click', function() {
            let data = [];
            let qty = $(this).siblings('input');
            let cartItem = $(this).closest('.single-cart-item');
            qty.val(function(i, oldval) {
                return parseInt(oldval, 10) + 1;
            });
            localData.map(function(localItem, index) {
                if (
                    localItem.productId == cartItem.data('product-id') &&
                    localItem.size == cartItem.find('.cart-item-size')[0].innerText
                ) {
                    localItem.count = qty.val();
                    localItem.price = localItem.price + cartItem.data('unit-price');
                }
                data.push(localItem);
            })
            localStorage.setItem('cart', JSON.stringify(data));
            renderMiniCart();
            console.log(cartItem.find('.cart-item-size')[0].innerText);
        })
    })

    $('.qtyminus').each(function(i, elm) {
        // console.log(elm)
        $(elm).on('click', function() {
            let data = [];
            let qty = $(this).siblings('input');
            let cartItem = $(this).closest('.single-cart-item');
            qty.val(function(i, oldval) {
                oldval = parseInt(oldval, 10);
                return (oldval - 1) > 0 ? oldval - 1 : 1;
            });
            localData.map(function(localItem, index) {
                if (
                    localItem.productId == cartItem.data('product-id') &&
                    localItem.size == cartItem.find('.cart-item-size')[0].innerText &&
                    qty.val() > 0 && localItem.price > localItem.unitPrice
                ) {
                    localItem.count = qty.val();
                    localItem.price = localItem.price - cartItem.data('unit-price');
                }
                data.push(localItem);
            })
            localStorage.setItem('cart', JSON.stringify(data));
            renderMiniCart();
            console.log(cartItem.find('.cart-item-size')[0].innerText);
        })
    })

    $('.remove-cart-item').each(function(i, elm) {
        $(elm).on('click', function(e) {
            e.preventDefault();
            console.log('deleted')
            let data = [];
            let cartItem = $(this).closest('.single-cart-item');
            localData.map(function(localItem, index) {
                    if (
                        localItem.productId !== cartItem.data('product-id') ||
                        (localItem.productId == cartItem.data('product-id') &&
                            localItem.size != cartItem.find('.cart-item-size')[0].innerText)
                    ) {
                        console.log(localItem.size, cartItem.find('.cart-item-size')[0].innerText);
                        data.push(localItem);
                    }
                })
                // console.log(localItem.productId == cartItem.data('product-id') &&
                // localItem.size != cartItem.find('.cart-item-size')[0].innerText)
            localStorage.setItem('cart', JSON.stringify(data));
            renderMiniCart();
        })
    })

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
    let qty = btn_parent.children[4].value;
    let img = btn_parent.children[0].src;
    let count = 1;
   
    let item = {
        'productId': productId,
        'name': name,
        'count': count,
        'price': price,
        'img': img,
        'qty': qty,
    }

    if (!$.isEmptyObject(item)) {
        // items.push(item);
        // console.log(JSON.stringify(items));
        setLSData(items, item);
        renderMiniCart();
        // localStorage.setItem('cart', JSON.stringify(items));
    }
}

renderMiniCart();
