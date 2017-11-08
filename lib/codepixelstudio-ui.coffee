{ CompositeDisposable } = require 'atom'

ClockView = require './clock-view'

module.exports = class CodePixelStudioUI

    attach: ->

        console.log 'attached'

        @renderUI()

    activate: ->

        console.log 'activated codepixel.studio.UI'

        @renderUI()

    deactivate: ->

        @disposables?.dispose()

        @CodePixelStudioClock?.destroy()

        @CodePixelStudioClock = null

    # consume
    consumeStatusBar: ( statusBar ) ->

        @clockView = new ClockView( statusBar )

        @clockView.attach()

        @CodePixelStudioClock = statusBar.addRightTile(

            item      : @clockView.el,
            priority  : 0

        )

    renderUI: ->

        # @consumeStatusBar( @renderClock )

        console.log 'rendered codepixel.studio.UI'
