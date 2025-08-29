import { userRole } from '../constents';
import { UserModel } from '../modules/user/user.model';

const adminSeeder = async () => {
  const admin = {
    name: 'Admin',
    email: 'admin@gmail.com',
    role: userRole.admin,
    password: '1',
    aggriedToTerms: true,
  };

  // check if admin already exists
  const adminExist = await UserModel.findOne({ role: userRole.admin });

  if (!adminExist) {
    console.log('Seeding admin....');

    try {
      // directly create without transaction
      const createAdmin = await UserModel.create(admin);

      console.log('✅ Admin created:', createAdmin);
    } catch (err) {
      console.error('❌ Error creating admin:', err);
      throw new Error('Admin could not be created');
    }
  } else {
    console.log('ℹ️ Admin already exists, skipping seeding.');
  }
};

export default adminSeeder;
