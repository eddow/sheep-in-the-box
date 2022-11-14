
 
export const load = async (event: Partial<Record<string, any>>) => {
  return {
    user: event.locals?.user
  };
}