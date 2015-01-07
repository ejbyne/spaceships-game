describe('homepage', function(){
  before(function(){
    casper.start('http://localhost:3000/');
  });

  it('homepage', function(){
    casper.then(function(){
      // expect("body").to.include.text("Spaceships");
      expect("body").to.contain.text("Spaceships");
    });
  });
});