import { IStats, Stats } from "@models";
import { httpMessages } from "@utils/HttpMessage";
import { IStatsInput } from "@typeInterface";

class StatsService {
  async createStat(statData: IStatsInput): Promise<IStats> {
    try {
      const newStat = new Stats(statData);
      await newStat.save();
      return newStat.toObject();
    } catch (error) {
      console.error("Error creating stat:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getStats(): Promise<IStats[] | null> {
    try {
      return await Stats.find();
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getStatById(statId: string): Promise<IStats | null> {
    try {
      const stat = await Stats.findById(statId);
      if (!stat) {
        throw httpMessages.NOT_FOUND("Stat not found");
      }
      return stat.toObject();
    } catch (error) {
      console.error("Error fetching stat by ID:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async updateStat(
    statId: string,
    statData: IStatsInput
  ): Promise<IStats | null> {
    try {
      const updatedStat = await Stats.findByIdAndUpdate(statId, statData, {
        new: true,
      });
      if (!updatedStat) {
        throw httpMessages.NOT_FOUND("Stat not found");
      }
      return updatedStat.toObject();
    } catch (error) {
      console.error("Error updating stat:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async deleteStat(statId: string): Promise<IStats | null> {
    try {
      const statToDelete = await Stats.findById(statId);
      if (!statToDelete) {
        throw httpMessages.NOT_FOUND("Stat not found");
      }

      await Stats.findByIdAndDelete(statId);
      return statToDelete.toObject();
    } catch (error) {
      console.error("Error deleting stat:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}

export const statsService = new StatsService();
