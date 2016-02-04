payMe = (amount, description, success) ->
  StripeCheckout.configure({
    key: 'pk_live_4W08g0QnXjtV2SZW2BCKOyex',
    token: (token) ->
      success(token)
      data = {amount: amount, description: description, stripeToken: token.id}
      $.ajax({
        url: 'http://civicvision-payment.herokuapp.com/pay',
        method: 'post'
        data: data
      })
    })

if $('#book-us').length > 0
  $('#book-us-week').click (e) ->
    e.preventDefault()
    amount = 2500*100
    description = "A work week of Civic Vision"
    success = (token) ->
      $('#thank-you').show()
    handler = payMe(amount, description, success)
    handler.open({
      name: 'Civic Vision UG',
      description: description,
      amount: amount,
      currency: 'EUR'
    })
  $('#pay-us-amount').click (e) ->
    e.preventDefault()
    $amount = $('#book-us #amount')
    amount = $amount.data('amount')
    invoiceNumber = $amount.data('number')
    description = "Invoice #{invoiceNumber} from Civic Vision"
    currency = 'EUR'
    if($amount.data('currency') == 'USD')
      currency = 'USD'

    success = (token) ->
      $('#thank-you').show()
    handler = payMe(amount, description, success)
    handler.open({
      name: 'Civic Vision UG',
      description: description,
      amount: amount,
      currency: currency
    })
