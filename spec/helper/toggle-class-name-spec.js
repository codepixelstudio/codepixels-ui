'use babel';

import toggleClassName from '../../lib/helper/toggle-class-name';

describe( 'guttersize toggle helper', () => {

    const guttertab = document.getElementsByClassName( 'tab-bar' );

    it( 'should add a className to the guttertab element', () => {

        expect( guttertab.classList.contains( 'testClass' ) ).toBe( false );

        toggleClassName( 'testClass', true );

        expect( guttertab.classList.contains( 'testClass' ) ).toBe( true );

    });

    it('should remove a className from the guttertab element', () => {

        expect( guttertab.classList.contains( 'testClass' ) ).toBe( true );

        toggleClassName( 'testClass', false );

        expect( guttertab.classList.contains( 'testClass' ) ).toBe( false );

    });

});
