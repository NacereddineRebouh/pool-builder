import { sides } from "@/slices/defaultsSlice";

export function getActiveAxis(params: sides): [boolean, boolean, boolean] {
  let pos: [boolean, boolean, boolean] = [true, true, true];
  switch (params) {
    case "Left":
      //Topleft
      pos[0] = false;
      pos[1] = true;
      pos[2] = false;
      break;
    case "Right":
      pos[0] = false;
      pos[1] = true;
      pos[2] = false;
      break;
    case "Top":
      //bottom Left
      pos[0] = false;
      pos[1] = true;
      pos[2] = false;
      break;
    case "Bottom":
      pos[0] = false;
      pos[1] = true;
      pos[2] = false;
      break;
  }

  return pos;
}

export const IgnoreOrderCompare = (a: string[], b: string[]) => {
  if (a?.length !== b?.length) return false;
  // if(a?.length==0) return false
  const elements = new Set<string>([...a, ...b]);
  for (const x of elements) {
    const count1 = a.filter((e) => e === x).length;
    const count2 = b.filter((e) => e === x).length;
    if (count1 !== count2) return false;
  }
  return true;
};
