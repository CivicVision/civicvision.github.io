payMe = (amount, description, currency, success) ->
  StripeCheckout.configure({
    key: 'pk_live_4W08g0QnXjtV2SZW2BCKOyex',
    token: (token) ->
      data = {amount: amount, currency: currency, description: description, stripeToken: token.id}
      $.ajax({
        url: 'http://civicvision-payment.herokuapp.com/pay',
        method: 'post'
        data: data
        success: (response) ->
          success(token)
      })
    })

if $('#landingpage .prices').length > 0
  $('#buy-standard-package').click (e) ->
    e.preventDefault()
    amount = 2000*100
    description = "The Standard Package for Donor Retention Automation."
    success = (token) ->
      $('#thank-you').show()
    handler = payMe(amount, description,'USD', success)
    handler.open({
      name: 'Civic Vision UG',
      description: description,
      amount: amount,
      zipCode: true,
      currency: 'USD'
    })
if $('#book-us').length > 0
  $('#book-us-week').click (e) ->
    e.preventDefault()
    amount = 2500*100
    description = "A work week of Civic Vision"
    success = (token) ->
      $('#thank-you').show()
    handler = payMe(amount, description,'EUR', success)
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
    handler = payMe(amount, description, currency, success)
    handler.open({
      name: 'Civic Vision UG',
      description: description,
      amount: amount,
      currency: currency
    })
if $('#qualifying').length > 0
	$('#qualifying .email').val($.querystring['email'])
	$('#qualifying .name').val($.querystring['name'])
	$('#qualifying .start').change((d) ->
    start = $(@).val()
    unless start == "six"
      $('#qualifying .why-start').show()
      $('#qualifying .start-begin').text($("#qualifying .start .#{start}").text())
    else
      $('#qualifying .why-start').hide()
	)

$(document).on('focus.textarea', '.auto-expand', ->
  savedValue = @value
  @value = ''
  @baseScrollHeight = @scrollHeight
  @value = savedValue
  return
).on 'input.textarea', '.auto-expand', ->
  minRows = @getAttribute('data-min-rows') | 0
  rows = undefined
  @rows = minRows
  rows = Math.ceil((@scrollHeight - (@baseScrollHeight)) / 17)
  @rows = minRows + rows
  return
