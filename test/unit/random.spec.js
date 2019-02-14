import random from '../../src/random'

const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/


describe('random', function() {
  it('should return a valid RFC4122 v4 guid', function(){
    const rnd = random()
    rnd.should.match(pattern)
  }) 
})

