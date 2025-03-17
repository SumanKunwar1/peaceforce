import "module-alias/register";
import app from "./app";
import { PORT } from "./config/env";
import connectDB from "./config/db";
import { ensureUploadFolderExists } from "./utils/filePath";
import { initializeAdminUser } from "./utils/initializeAdmin";

app.listen(PORT, async () => {
  await connectDB();
  await ensureUploadFolderExists();
  await initializeAdminUser();
  console.log(`Server running at http://localhost:${PORT}`);
});
