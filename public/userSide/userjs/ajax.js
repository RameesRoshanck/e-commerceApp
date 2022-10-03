


function addToCart(proId){
    $.ajax({
        url:'/add-to-cart/'+proId,
        method:'get',
        success:(response)=>{
            if(response.status){
                let count=$('#cart-count').html()
                count=parseInt(count)+1
                $('#cart-count').html(count)
                location.reload()
            }
        }
    })
}

function changeQuantity(cartId,proId,userId,count){
    event.preventDefault()
    let quantity=parseInt(document.getElementById(proId).innerHTML)
    console.log(userId);
    count=parseInt(count)
    $.ajax({
        url:'/change-product-quantity',
        data:{
            user:userId,
            cart:cartId,
            product:proId,
            count:count,
            quantity:quantity
             },
        method:'post',
        success:(response)=>{
           if(response.removeProduct){
            alert("remove one product")
            location.reload()
           }else{
            console.log(response.subTotal);
            document.getElementById(proId).innerHTML=quantity+count
            document.getElementById('total').innerHTML=response.total
            document.getElementById('q'+proId).innerHTML= response.proTotal
           }
        }
    })
}

function deleteCartProduct(cartId,proId){
        $.ajax({
            url:'/deleteCartItems',
            data:{
                product:proId,
                cart:cartId
            },
            method:'post',
            success:(response)=>{
                alert("this item is deleted")
                location.reload()
            }
        })
}

function addtowishlist(proId){
    // let count = parseInt(document.getElementById('wishlistCount').innerHTML)
     $.ajax({
        url:'/add-to-wishlist/'+proId,
        method:'get',
        success:(response)=>{
            if(response.status){
                // alert(response.status)
                let count=$('#wishlistCount').html()
                count=parseInt(count)+1
                $('#wishlistCount').html(count)
                // location.reload()
                // count=parseInt(count)+1
                // document.getElementById('wishlistCount').innerHTML=count
            }else{
                // alert(response);
                location.reload()
            }
        }
      
     })
}

/* ----------------------------- delete wishlist ---------------------------- */

function deleteWishlist(WishId,proId){
    $.ajax({
        url:'/deleteWishlist',
        data:{
            product:proId,
            wishlist:WishId
        },
        method:'post',
        success:(response=>{
            alert("this item is deleted")
            location.reload()
        })
    })
}

function applyCoupon(event){
    event.preventDefault()
    let coupon=document.getElementById('couponName').value
    // console.log(coupon);
    alert(coupon)
    $.ajax({
        url:'/applayCoupon',
        data:{ coupon },
        method:'post',
        success:(response)=>{
            if(response.varifying)
            {
                alert(response.TotalAmount,'====')
                document.getElementById('total').innerHTML='₹'+response.TotalAmount
              document.getElementById('discount').innerHTML='₹'+response.subAmount  
              document.getElementById('error').innerHTML=''    
            }else{
                alert(response.Total)
                document.getElementById('total').innerHTML='₹'+ response.Total
                document.getElementById('discount').innerHTML='₹'+ 0

                if(response.invalidCoupon){
                    document.getElementById('error').innerHTML=response.invalidMessage 
                }
                else if(response.dateInvalid)
                {
                    document.getElementById('error').innerHTML=response.dateInvalidMessage
                }
                else if(response.invaidMinAmount)
                {
                    document.getElementById('error').innerHTML=response.minAmoutMsg
                }
                else if(response.invalidMaxAmount)
                {
                    alert(response.maxAmountMsg)
                    document.getElementById('error').innerHTML=response.maxAmountMsg
                }
                else if(response.noCoupon){
                    document.getElementById('error').innerHTML='invalid coupon details'
                }
            } 
        }
    })
}

function removeCoupon(event){
    event.preventDefault()
    alert('remove')
    $.ajax({
        url:'/removeCoupon',
        method:'get',
        success:(response)=>{
            alert(response)
            document.getElementById('total').innerHTML='₹'+ response
            document.getElementById('discount').innerHTML='₹'+ 0
            document.getElementById('couponName').value = ''
        }
    })
}