class @Drip
  constructor: () ->
    @currentVisitor = {}
    @isAnonymous = true
    @callbacks = []

  setCallbacks: (callbacks) ->
    @callbacks = callbacks

  hasTag: (tag) ->
    tag in @currentVisitor.tags

  attr: (attr) ->
    @currentVisitor.customFields[attr]

  sendEvent: (eventName, amount) ->
    value = {}
    if(amount)
      value.value = amount
    _dcq.push(["track", eventName, value])

  subscribe: (campaignId, payload) ->
    _dcq.push(["subscribe", { campaign_id: campaignId, fields: payload}])

  visitorUpdated: ->
    @callbacks.forEach (callback) =>
      callback.call()

  dripResponse: (payload) ->
    if payload.success
      @isAnonymous = payload.anonymous
      unless @isAnonymous
        @currentVisitor.email = payload.email
        @currentVisitor.tags = payload.tags
        @currentVisitor.customFields = payload.custom_fields
        @visitorUpdated()

class ReplaceContent
  replace: (cssPath, content) ->
    $(cssPath).html(content)

class SanDiego extends ReplaceContent
  update: =>
    if window.drip.hasTag('NGO') and window.drip.attr('Location') == 'San Diego'
      @replace('#welcome h2', 'Data Consultancy for Social Good in San Diego')


$ ->
  window.drip = new Drip()
  #sd = new SanDiego()
  #window.drip.setCallbacks([sd.update])
  _dcq.push(["identify", {success: window.drip.dripResponse.bind(window.drip)}])
