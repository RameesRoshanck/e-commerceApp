



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
            success:(response=>{
                alert("this item is deleted")
                location.reload()
            })
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