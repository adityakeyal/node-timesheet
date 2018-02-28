var datemod = require('../date');
const expect = require('chai').expect

describe('Formatted date module', function(){

    it('retuns date string given date' , function(){

        var date = new Date();
        date.setMonth(0);
        date.setDate(1);
        date.setFullYear(2018);
        const result = datemod.formatDate(date);

        
        expect(result).to.eql('01-01-2018');


    });


    it('retuns date no argument' , function(){

        var date = new Date();
        
        const expected = datemod.formatDate(date);
        const result = datemod.formatDate();

        
        expect(result).to.eql(expected);


    });


});