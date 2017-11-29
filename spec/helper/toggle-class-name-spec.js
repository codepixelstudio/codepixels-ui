'use babel';

import toggleClassName from '../../lib/helper/toggle-class-name';

describe( 'pane size toggle helper', () => {

    const panesizer = document.getElementsByClassName( 'workspace' );

    it( 'should add a className to the panesizer element', () => {

        expect( panesizer.classList.contains( 'testClass' ) ).toBe( false );

        toggleClassName( 'testClass', true );

        expect( panesizer.classList.contains( 'testClass' ) ).toBe( true );

    });

    it('should remove a className from the panesizer element', () => {

        expect( panesizer.classList.contains( 'testClass' ) ).toBe( true );

        toggleClassName( 'testClass', false );

        expect( panesizer.classList.contains( 'testClass' ) ).toBe( false );

    });

});
