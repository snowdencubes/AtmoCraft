import { usersRepo } from '@/lib/db/repos';
import { hashPassword, verifyPassword } from '@/lib/auth-crypto';
import { User } from '@/lib/types';

export const authService = {
  async signup(data: any) {
    const existingUser = await usersRepo.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await hashPassword(data.password);
    
    // Create pending user
    const newUser: User = {
      id: crypto.randomUUID(),
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      role: data.role || 'trainee', // Default or from form
      avatar: '/avatars/default.png',
      department: data.department || 'General',
      status: 'pending',
      createdAt: new Date().toISOString(),
      // In a real app we'd save the hashed password in a credentials table
    };

    // Storing password is mocked here, normally we'd extend the user or have another table
    (newUser as any)._passwordHash = hashedPassword;

    return await usersRepo.create(newUser);
  },

  async login(email: string, password: string): Promise<User> {
    const user = await usersRepo.findByEmail(email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Since mock users might not have _passwordHash, we'll allow any password for them if they are active
    // For newly created users, we check the hash
    if ((user as any)._passwordHash) {
      const isValid = await verifyPassword(password, (user as any)._passwordHash);
      if (!isValid) {
        throw new Error('Invalid email or password');
      }
    }

    if (user.status === 'pending') {
      throw new Error('Account pending admin approval');
    }
    
    if (user.status === 'inactive') {
      throw new Error('Account is inactive');
    }

    return user;
  },

  async approveUser(id: string) {
    const user = await usersRepo.update(id, { status: 'active' });
    if (user) {
      // Logic to create notification could go here
      console.log(`Notification: Account approved for ${user.name}`);
    }
    return user;
  },

  async rejectUser(id: string) {
    const user = await usersRepo.update(id, { status: 'inactive' });
    if (user) {
      console.log(`Notification: Account rejected for ${user.name}`);
    }
    return user;
  },

  async deactivateUser(id: string) {
    const user = await usersRepo.update(id, { status: 'inactive' });
    if (user) {
      console.log(`Notification: Account deactivated for ${user.name}`);
    }
    return user;
  }
};
