const prisma = require("../prisma");
const seed = async () => {
  const createCustomer = async () => {
    const customers = [
      { name: "John" },
      { name: "Smith" },
      { name: "Steph" },
      { name: "James" },
    ];
    await prisma.customer.createMany({ data: customers });
  };
  const createReservation = async () => {
    const reservations = [
      {
        date: new Date("2024-12-19"),
        partyCount: 10,
        customerId: 3,
      },
      {
        date: new Date("2024-12-20"),
        partyCount: 5,
        customerId: 4,
      },
    ];
    await prisma.reservation.createMany({ data: reservations });
  };
  const createRestaurant = async () => {
    const restaurants = [
      { name: "Olive Garden", reservationId: 1 },
      { name: "Red Robbin", reservationId: 2 },
    ];
    await prisma.restaurant.createMany({ data: restaurants });
  };

  await createCustomer();
  await createReservation();
  await createRestaurant();
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
