const express = require("express");
const app = express();
const port = 3000;

const prisma = require("./prisma");

app.use(express.json());
app.use(require("morgan")("dev"));

app.get("/api/customers", async (req, res, next) => {
  try {
    const response = await prisma.customer.findMany();
    res.json(response);
  } catch (error) {
    next(error);
  }
});

app.get("/api/reservations", async (req, res, next) => {
  try {
    const response = await prisma.reservation.findMany();
    res.json(response);
  } catch (error) {
    next(error);
  }
});

app.get("/api/restaurants", async (req, res, next) => {
  try {
    const response = await prisma.restaurant.findMany();
    res.json(response);
  } catch (error) {
    next(error);
  }
});

app.post("/api/customers/:id/reservations", async (req, res, next) => {
  try {
    const customerId = +req.params.id;
    const { date, partyCount } = req.body;
    const response = await prisma.reservation.create({
      data: {
        date,
        partyCount,
        customerId,
      },
    });
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

app.delete(
  "/api/customers/:customerId/reservations/:id",
  async (req, res, next) => {
    try {
      const id = +req.params.id;
      const reservationExists = await prisma.reservation.findFirst({
        where: { id },
      });
      if (!reservationExists) {
        return next({
          status: 404,
          message: `Could not find reservation with id ${id}.`,
        });
      }
      await prisma.reservation.delete({ where: { id } });
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);
// Simple error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status ?? 500;
  const message = err.message ?? "Internal server error.";
  res.status(status).json({ message });
});

app.listen(port, () => console.log(`listening to the port ${port}`));
