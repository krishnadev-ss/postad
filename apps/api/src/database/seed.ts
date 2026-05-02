import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clean existing data
  await prisma.activity.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.adSpace.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin user
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@postad.com',
      password_hash: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Create Provider user
  const providerPassword = await bcrypt.hash('Provider@123', 12);
  const providerUser = await prisma.user.create({
    data: {
      name: 'John Billboard',
      email: 'provider@postad.com',
      password_hash: providerPassword,
      role: Role.PROVIDER,
    },
  });
  console.log(`Created provider user: ${providerUser.email}`);

  // Create Provider profile
  const provider = await prisma.provider.create({
    data: {
      user_id: providerUser.id,
      company_name: 'Billboard Masters Inc.',
      contact_info: '+1-555-0100 | contact@billboardmasters.com',
    },
  });
  console.log(`Created provider profile: ${provider.company_name}`);

  // Create Advertiser user
  const advertiserPassword = await bcrypt.hash('Advertiser@123', 12);
  const advertiser = await prisma.user.create({
    data: {
      name: 'Sarah Marketer',
      email: 'advertiser@postad.com',
      password_hash: advertiserPassword,
      role: Role.ADVERTISER,
    },
  });
  console.log(`Created advertiser user: ${advertiser.email}`);

  // Create sample AdSpaces
  const adspace1 = await prisma.adSpace.create({
    data: {
      provider_id: provider.id,
      title: 'Times Square Giant Billboard',
      location: 'Times Square, New York, NY',
      latitude: 40.758,
      longitude: -73.9855,
      type: 'Billboard',
      price_per_day: 5000,
      is_available: true,
    },
  });

  const adspace2 = await prisma.adSpace.create({
    data: {
      provider_id: provider.id,
      title: 'LA Highway Digital Screen',
      location: 'Highway 101, Los Angeles, CA',
      latitude: 34.0522,
      longitude: -118.2437,
      type: 'Digital Screen',
      price_per_day: 2500,
      is_available: true,
    },
  });

  const adspace3 = await prisma.adSpace.create({
    data: {
      provider_id: provider.id,
      title: 'Chicago Transit Bus Shelter',
      location: 'Michigan Avenue, Chicago, IL',
      latitude: 41.8781,
      longitude: -87.6298,
      type: 'Bus Shelter',
      price_per_day: 800,
      is_available: true,
    },
  });

  console.log(`Created 3 sample adspaces`);

  // Log activities for adspace creation
  await prisma.activity.createMany({
    data: [
      {
        user_id: providerUser.id,
        type: 'ADSPACE_CREATED',
        message: `Ad space "${adspace1.title}" was created`,
        metadata: { adspace_id: adspace1.id },
      },
      {
        user_id: providerUser.id,
        type: 'ADSPACE_CREATED',
        message: `Ad space "${adspace2.title}" was created`,
        metadata: { adspace_id: adspace2.id },
      },
      {
        user_id: providerUser.id,
        type: 'ADSPACE_CREATED',
        message: `Ad space "${adspace3.title}" was created`,
        metadata: { adspace_id: adspace3.id },
      },
    ],
  });

  // Create a sample booking
  const booking = await prisma.booking.create({
    data: {
      user_id: advertiser.id,
      adspace_id: adspace2.id,
      start_date: new Date('2026-06-01'),
      end_date: new Date('2026-06-30'),
      status: 'PENDING',
    },
  });

  await prisma.activity.create({
    data: {
      user_id: advertiser.id,
      type: 'BOOKING_CREATED',
      message: `Booking created for "${adspace2.title}"`,
      metadata: { booking_id: booking.id, adspace_id: adspace2.id },
    },
  });

  console.log('Created sample booking with activity');
  console.log('\n=== Seed Complete ===');
  console.log('Admin:      admin@postad.com      / Admin@123');
  console.log('Provider:   provider@postad.com   / Provider@123');
  console.log('Advertiser: advertiser@postad.com / Advertiser@123');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
