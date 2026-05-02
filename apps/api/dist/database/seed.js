"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting database seed...');
    await prisma.activity.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.adSpace.deleteMany();
    await prisma.provider.deleteMany();
    await prisma.user.deleteMany();
    const adminPassword = await bcrypt.hash('Admin@123', 12);
    const admin = await prisma.user.create({
        data: {
            name: 'Super Admin',
            email: 'admin@postad.com',
            password_hash: adminPassword,
            role: client_1.Role.ADMIN,
        },
    });
    console.log(`Created admin user: ${admin.email}`);
    const providerPassword = await bcrypt.hash('Provider@123', 12);
    const providerUser = await prisma.user.create({
        data: {
            name: 'John Billboard',
            email: 'provider@postad.com',
            password_hash: providerPassword,
            role: client_1.Role.PROVIDER,
        },
    });
    console.log(`Created provider user: ${providerUser.email}`);
    const provider = await prisma.provider.create({
        data: {
            user_id: providerUser.id,
            company_name: 'Billboard Masters Inc.',
            contact_info: '+1-555-0100 | contact@billboardmasters.com',
        },
    });
    console.log(`Created provider profile: ${provider.company_name}`);
    const advertiserPassword = await bcrypt.hash('Advertiser@123', 12);
    const advertiser = await prisma.user.create({
        data: {
            name: 'Sarah Marketer',
            email: 'advertiser@postad.com',
            password_hash: advertiserPassword,
            role: client_1.Role.ADVERTISER,
        },
    });
    console.log(`Created advertiser user: ${advertiser.email}`);
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
//# sourceMappingURL=seed.js.map