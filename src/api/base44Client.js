export const base44 = {
  async chat(message) {
    // Placeholder response until backend is added
    return {
      reply: "AI is offline in local mode. Vercel backend required."
    };
  },

  async saveGoal(goal) {
    console.log("Goal saved (mock):", goal);
    return { success: true };
  },

  async getGoals() {
    return [];
  },

  async saveMood(mood) {
    console.log("Mood saved (mock):", mood);
    return { success: true };
  },

  async getMoods() {
    return [];
  }
};
