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

    it('returns range of days in mid of january' , function(){

        var date = new Date();
        date.setDate(14);
        date.setMonth(0);
        date.setFullYear(2018);
        var range = datemod.fetchDaysInMonth(date);
        expect(range.length).to.eql(14);

    });

    it('returns range of days in 1st day of january' , function(){

        var date = new Date();
        date.setDate(1);
        date.setMonth(0);
        date.setFullYear(2018);
        var range = datemod.fetchDaysInMonth(date);
        expect(range.length).to.eql(1);

    });

    
    it('returns range of days in last day of january' , function(){

        var date = new Date();
        date.setDate(31);
        date.setMonth(0);
        date.setFullYear(2018);
        var range = datemod.fetchDaysInMonth(date);

        expect(range.length).to.eql(31);

    });

    it('returns business days in month of january' , function(){


        var date = new Date();
        date.setDate(31);
        date.setMonth(0);
        date.setFullYear(2018);
        var range = datemod.fetchBusinessDaysInMonth(date);

        expect(range.length).to.eql(23);
        

    });


});