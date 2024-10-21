import { expect } from 'chai';
// import sinon from 'sinon';
import { formatDate , formatPrice , formatCurrency ,shiftToNumber ,getDaysOfWeek} from '../services/format.js';


// Test case format Date
describe('formatDate', () => {
    it('should format the date correctly', () => {
        const date = '2024-01-01';
        const formattedDate = formatDate(date);
        expect(formattedDate).to.equal('01-01-2024');
    });
});
// End Test case format Date


// Test case format Price
describe('formatPrice', () => {
    it('should format the price correctly', () => {
      expect(formatPrice(1000)).to.equal('1.000đ');
      expect(formatPrice(1000000)).to.equal('1.000.000đ');
      expect(formatPrice(1234567)).to.equal('1.234.567đ');
    });
  
    it('should handle zero and small numbers', () => {
      expect(formatPrice(0)).to.equal('0đ');
      expect(formatPrice(1)).to.equal('1đ');
      expect(formatPrice(999)).to.equal('999đ');
    });
  
    it('should handle decimal numbers', () => {
      expect(formatPrice(1000.5)).to.equal('1.000,5đ');
      expect(formatPrice(1234567.89)).to.equal('1.234.567,89đ');
    });
  });
  // End Test case format Price



// Format currency
  describe('formatCurrency', () => {
    it('should format whole numbers correctly', () => {
      expect(formatCurrency(1000)).to.equal('1.000');
      expect(formatCurrency(1000000)).to.equal('1.000.000');
      expect(formatCurrency(1234567)).to.equal('1.234.567');
    });
  
    it('should handle zero and small numbers', () => {
      expect(formatCurrency(0)).to.equal('0');
      expect(formatCurrency(1)).to.equal('1');
      expect(formatCurrency(999)).to.equal('999');
    });
  
    it('should handle decimal numbers', () => {
      expect(formatCurrency(1000.5)).to.equal('1.000.5');
      expect(formatCurrency(1234567.89)).to.equal('1.234.567.89');
    });
  
    it('should handle string input', () => {
      expect(formatCurrency('1000')).to.equal('1.000');
      expect(formatCurrency('1000000')).to.equal('1.000.000');
    });
  
    it('should handle large numbers', () => {
      expect(formatCurrency(1000000000)).to.equal('1.000.000.000');
    });
  });

// End format currentcy




// describe('generateUserId', () => {
//     let dbQueryStub;
  
//     beforeEach(() => {
//       // Mock the db.query function
//       dbQueryStub = sinon.stub().resolves([]);
//       global.db = { query: dbQueryStub };
//     });
  
//     afterEach(() => {
//       // Restore the original function after each test
//       sinon.restore();
//     });
  
//     it('should generate the first ID when no existing IDs', async () => {
//       dbQueryStub.resolves([{ maxId: null }]);
//       const result = await generateUserId('US', 'users', 'user_id');
//       expect(result).to.equal('US0001');
//     });
  
//     it('should generate the next ID based on the highest existing ID', async () => {
//       dbQueryStub.resolves([{ maxId: 5 }]);
//       const result = await generateUserId('US', 'users', 'user_id');
//       expect(result).to.equal('US0006');
//     });
  
//     it('should handle large existing IDs', async () => {
//       dbQueryStub.resolves([{ maxId: 9999 }]);
//       const result = await generateUserId('US', 'users', 'user_id');
//       expect(result).to.equal('US10000');
//     });
  
//     it('should use the correct query', async () => {
//       await generateUserId('AD', 'admins', 'admin_id');
//       expect(dbQueryStub.calledOnce).to.be.true;
//       expect(dbQueryStub.firstCall.args[0]).to.equal(
//         "SELECT MAX(CAST(SUBSTRING(admin_id, LENGTH('AD') + 1) AS UNSIGNED)) AS maxId FROM admins WHERE admin_id LIKE 'AD%'"
//       );
//     });
  
//     it('should handle different role prefixes', async () => {
//       dbQueryStub.resolves([{ maxId: 3 }]);
//       const result = await generateUserId('MG', 'managers', 'manager_id');
//       expect(result).to.equal('MG0004');
//     });
//   });



// Shift to number
describe('shiftToNumber', () => {
    it('should return 1 for shift "7h-9h"', () => {
      expect(shiftToNumber('7h-9h')).to.equal(1);
    });
  
    it('should return 2 for shift "9h-11h"', () => {
      expect(shiftToNumber('9h-11h')).to.equal(2);
    });
  
    it('should return 3 for shift "13h-15h"', () => {
      expect(shiftToNumber('13h-15h')).to.equal(3);
    });
  
    it('should return 4 for shift "15h-17h"', () => {
      expect(shiftToNumber('15h-17h')).to.equal(4);
    });
  
    it('should return 5 for any other input', () => {
      expect(shiftToNumber('invalid shift')).to.equal(5);
      expect(shiftToNumber('')).to.equal(5);
      expect(shiftToNumber('18h-20h')).to.equal(5);
    });
  });

// End Shift to number

// const getDaysOfWeek = (offset) => {
//     const startOfWeek = new Date();
//     startOfWeek.setDate(
//       startOfWeek.getDate() - startOfWeek.getDay() + 1 + offset * 7
//     ); 




    