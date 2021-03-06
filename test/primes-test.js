/* eslint-env mocha */
/* eslint prefer-arrow-callback: 'off' */
/* eslint camelcase: "off" */

'use strict';

const assert = require('bsert');
const BN = require('bcrypto/lib/bn.js');
const random = require('bcrypto/lib/random');
const primes = require('../lib/js/primes');
const {primes1024} = require('./util');

// https://github.com/golang/go/blob/aadaec5/src/math/big/prime_test.go
const primes_ = [
  ['2'],
  ['3'],
  ['5'],
  ['7'],
  ['11'],

  ['13756265695458089029'],
  ['13496181268022124907'],
  ['10953742525620032441'],
  ['17908251027575790097'],

  // https://golang.org/issue/638
  ['18699199384836356663'],

  ['98920366548084643601728869055592650835572950',
   '932266967461790948584315647051443'],

  ['94560208308847015747498523884063394671606671',
   '904944666360068158221458669711639'],

  // https://primes.utm.edu/lists/small/small3.html
  ['44941799905544149399470929709310851301537378',
   '70495584992054923478717299275731182628115083',
   '86655998299074566974373711472560655026288668',
   '09429169935784346436300314467494034591243112',
   '9144354948751003607115263071543163'],

  ['23097585999320415066642353898855783955556024',
   '39290654154349809042583105307530067238571397',
   '42334640122533598517597674807096648905501653',
   '46168760133978281431612497154796891289321400',
   '2992086353183070342498989426570593'],

  ['55217120996659062215404232070193333791252654',
   '62121169655563495403888449493493629943498064',
   '60453696177511076537774555037706789360724602',
   '06949729597808391514524577288553821135558677',
   '43022746090187341871655890805971735385789993'],

  ['20395687835640197740576586692903457728019399',
   '33143482630947726464532830627227012776329366',
   '16063144088173312372882677123879538709400158',
   '30656733832827915449969836607190676644003707',
   '42171178056908727928481491120222863321448761',
   '83376326512083574821647933992961249917319836',
   '219304274280243803104015000563790123'],

  // ECC primes: https://tools.ietf.org/html/draft-ladd-safecurves-02
  // Curve1174: 2^251-9

  ['36185027886661311069865932815214971204146870',
   '20801267626233049500247285301239'],

  // Curve25519: 2^255-19

  ['57896044618658097711785492504343953926634992',
   '332820282019728792003956564819949'],

  // E-382: 2^382-105

  ['98505015490986198030697600250359034512699348',
   '17616361666987073351061430442874302652853566',
   '563721228910201656997576599'],

  // Curve41417: 2^414-17

  ['42307582002575910332922579714097346549017899',
   '70971399803421752289756197063912392613281210',
   '9468141778230245837569601494931472367'],

  // E-521: 2^521-1

  ['68647976601306097149819007990813932172694353',
   '00143305409394463459185543183397656052122559',
   '64066145455497729631139148085803712198799971',
   '6643812574028291115057151'],

  // P-112

  ['4451685225093714772084598273548427'],

  // P-192

  ['62771017353866807638357894232076664160839087',
   '00390324961279'],

  // P-224

  ['26959946667150639794667015087019630673557916',
   '260026308143510066298881'],

  // P-256

  ['11579208921035624876269744694940757353008614',
   '3415290314195533631308867097853951'],

  // P-384

  ['39402006196394479212279040100143613805079739',
   '27046544666794829340424572177149687032904726',
   '6088258938001861606973112319'],

  // K-256

  ['11579208923731619542357098500868790785326998',
   '4665640564039457584007908834671663'],

  // K-256 Order

  ['11579208923731619542357098500868790785283756',
   '4279074904382605163141518161494337'],

  // P-448

  ['72683872429560689054932380788800453435364136',
   '06873180602814901991806123281667307726863963',
   '83698676545930088884461843637361053498018365',
   '439']
];

const composites = [
  ['0'],
  ['1'],
  ['2128417509121468791277119989830729774821167291',
   '4763848041968395774954376176754'],
  ['6084766654921918907427900243509372380954290099',
   '172559290432744450051395395951'],
  ['8459435049322191838921335299203232428036771124',
   '7940675652888030554255915464401'],
  ['82793403787388584738507275144194252681'],

  // Arnault, 'Rabin-Miller Primality Test: Composite Numbers Which Pass It',
  // Mathematics of Computation, 64(209) (January 1995), pp. 335-361.

  // Strong pseudoprime to prime bases 2 through 29.
  ['1195068768795265792518361315725116351898245581'],

  // Strong pseudoprime to all prime bases up to 200.
  ['8038374574536394912570796143419421081388376882',
   '8755814583748891752229742737653336521865023361',
   '6396004545791504202360320876656996676098728404',
   '3965408232928738791850869166857328267761771029',
   '3896977394701670823042868710999743997654414484',
   '5341155872450633409279022275296229414984230688',
   '1685404326457534018329786111298960644845216191',
   '652872597534901'],

  // Extra-strong Lucas pseudoprimes.
  // https://oeis.org/A217719
  ['989'],
  ['3239'],
  ['5777'],
  ['10877'],
  ['27971'],
  ['29681'],
  ['30739'],
  ['31631'],
  ['39059'],
  ['72389'],
  ['73919'],
  ['75077'],
  ['100127'],
  ['113573'],
  ['125249'],
  ['137549'],
  ['137801'],
  ['153931'],
  ['155819'],
  ['161027'],
  ['162133'],
  ['189419'],
  ['218321'],
  ['231703'],
  ['249331'],
  ['370229'],
  ['429479'],
  ['430127'],
  ['459191'],
  ['473891'],
  ['480689'],
  ['600059'],
  ['621781'],
  ['632249'],
  ['635627'],

  ['3673744903'],
  ['3281593591'],
  ['2385076987'],
  ['2738053141'],
  ['2009621503'],
  ['1502682721'],
  ['255866131'],
  ['117987841'],
  ['587861'],

  ['6368689'],
  ['8725753'],
  ['80579735209'],
  ['105919633']
];

describe('Primes', function() {
  const key = random.randomBytes(32);
  const zero = Buffer.alloc(32, 0x00);

  for (let i = 0; i < primes_.length; i++) {
    const str = primes_[i].join('');

    it(`should test prime (${i})`, () => {
      const p = BN.fromString(str, 10);

      assert(primes.isPrimeDiv(p));
      assert(primes.isPrimeMR(p, key, 16 + 1, true));
      assert(primes.isPrimeMR(p, key, 1, true));
      assert(primes.isPrimeMR(p, key, 1, false));
      assert(primes.isPrimeLucas(p));
      assert(primes.isPrime(p, key));
    });
  }

  for (let i = 0; i < composites.length; i++) {
    const str = composites[i].join('');

    it(`should test composite (${i})`, () => {
      const p = BN.fromString(str, 10);

      if (i === 6 || i === 7 || (i >= 43 && i <= 49) || i === 54) {
        assert(primes.isPrimeDiv(p));
      } else {
        // We actually catch a surpising
        // number of composites here.
        assert(!primes.isPrimeDiv(p));
      }

      // MR with a deterministic key.
      assert(!primes.isPrimeMR(p, zero, 16 + 1, true));
      assert(!primes.isPrimeMR(p, zero, 4, true));
      assert(!primes.isPrimeMR(p, zero, 4, false));

      if (i >= 8 && i <= 42) {
        // Lucas pseudoprime.
        assert(primes.isPrimeLucas(p));
      } else {
        assert(!primes.isPrimeLucas(p));
      }

      // No composite should ever pass
      // Baillie-PSW, random or otherwise.
      assert(!primes.isPrime(p, zero));
      assert(!primes.isPrime(p, key));
    });
  }

  it('should test hardcoded primes', () => {
    const items = [...primes.smallPrimes, ...primes.testPrimes];

    for (const n of items) {
      const p = new BN(n);

      assert(primes.isPrimeDiv(p) === 1);
      assert(primes.isPrimeMR(p, key, 16 + 1, true));
      assert(primes.isPrimeMR(p, key, 1, true));
      assert(primes.isPrimeMR(p, key, 1, false));
      assert(primes.isPrimeLucas(p));
      assert(primes.isPrime(p, key));
    }
  });

  it('should test 1024 bit primes', () => {
    for (const n of primes1024) {
      const p = new BN(n);

      assert(primes.isPrimeDiv(p));
      assert(primes.isPrimeMR(p, key, 16 + 1, true));
      assert(primes.isPrimeMR(p, key, 1, true));
      assert(primes.isPrimeMR(p, key, 1, false));
      assert(primes.isPrimeLucas(p));
      assert(primes.isPrime(p, key));
    }
  });

  it('should get next prime (1)', () => {
    assert.strictEqual(primes.nextPrime(new BN(4), zero, 512).toString(), '5');
  });

  it('should get next prime (2)', () => {
    const p = BN.decode(primes1024[0]).addn(1);
    const expect = p.addn(885);
    const r1 = primes.nextPrime(p, zero, 884);
    const r2 = primes.nextPrime(p, zero, 885);

    assert.strictEqual(r1.toString(), '0');
    assert.strictEqual(r2.toString(), expect.toString());
  });
});
