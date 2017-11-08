
class ClockView

    constructor: ( @statusBar ) ->

        # @el = document.createElement 'codepixel-clock'
        # @txt = document.createElement 'span'

        # @el.classList.add 'codepixel-studio-clock', 'inline-block'
        # @txt.classList.add 'message'

        # @el.appendChild @txt

        @attach( @el )

    attach: ->

        @render( @el )

    detach: ->

        @el.remove()

        console.log 'detached codepixel.studio.clock'

    destroy: ->

        @detach()

    render: ->

        @el.innerText = 'ball so hard'

        console.log 'rendered codepixel.studio.clock'

        return @el

module.exports = ClockView
