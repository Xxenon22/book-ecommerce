import { supabase } from "./supabase/index";
import { useRouter } from "vue-router";

export const checkAuth = async () => {
    const router = useRouter();
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
        router.push("/login");
    }
};
