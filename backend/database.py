import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)


def get_profile(user_id: str):
    profile = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
    skills = supabase.table("user_skills").select("*, skills(name)").eq("user_id", user_id).execute()

    teach_skills = [s["skills"]["name"] for s in skills.data if s["type"] == "teach"]
    learn_skills = [s["skills"]["name"] for s in skills.data if s["type"] == "learn"]

    return {
        "username": profile.data["username"],
        "bio": profile.data["bio"],
        "teach_skills": teach_skills,
        "learn_skills": learn_skills
    }


def save_profile(user_id: str, bio: str, teach_skills: list, learn_skills: list):
    supabase.table("profiles").update({
        "bio": bio
    }).eq("id", user_id).execute()

    supabase.table("user_skills").delete().eq("user_id", user_id).execute()

    for skill_name in teach_skills:
        skill = supabase.table("skills").select("id").eq("name", skill_name).execute()
        if not skill.data:
            skill = supabase.table("skills").insert({"name": skill_name}).execute()
        skill_id = skill.data[0]["id"]
        supabase.table("user_skills").insert({
            "user_id": user_id,
            "skill_id": skill_id,
            "type": "teach"
        }).execute()

    for skill_name in learn_skills:
        skill = supabase.table("skills").select("id").eq("name", skill_name).execute()
        if not skill.data:
            skill = supabase.table("skills").insert({"name": skill_name}).execute()
        skill_id = skill.data[0]["id"]
        supabase.table("user_skills").insert({
            "user_id": user_id,
            "skill_id": skill_id,
            "type": "learn"
        }).execute()


def get_next_swipe(user_id: str):
    swiped = supabase.table("swipes").select("swiped_id").eq("swiper_id", user_id).execute()
    swiped_ids = [s["swiped_id"] for s in swiped.data]
    swiped_ids.append(user_id)

    new_id_data = supabase.table("profiles").select("id").not_.in_("id", swiped_ids).limit(1).execute()
    if new_id_data.data:
        new_id = new_id_data.data[0]["id"]
        match_data = supabase.table("swipes").select("*").eq("swiper_id", new_id).eq("swiped_id", user_id)\
            .eq("direction", "like").execute()
        is_match = len(match_data.data) > 0
        return {"id": new_id, "is_match": is_match, **get_profile(new_id)}
    return None


def record_swipe(swiper_id: str, swiped_id: str, direction: str):
    supabase.table("swipes").insert({
        "swiper_id": swiper_id,
        "swiped_id": swiped_id,
        "direction": direction
    }).execute()


def are_matched(user_a: str, user_b: str) -> bool:
    """Return True only if the two users have an existing match."""
    result = supabase.table("matches").select("id").or_(
        f"and(user1_id.eq.{user_a},user2_id.eq.{user_b}),"
        f"and(user1_id.eq.{user_b},user2_id.eq.{user_a})"
    ).execute()
    return len(result.data) > 0


def get_matches(user_id: str):
    match_data = supabase.table("matches").select("*").or_(f"user1_id.eq.{user_id},user2_id.eq.{user_id}").execute().data
    if not match_data:
        return None

    match_ids = []
    for row in match_data:
        if row["user1_id"] == user_id:
            match_ids.append(row["user2_id"])
        else:
            match_ids.append(row["user1_id"])

    profiles = supabase.table("profiles").select("*").in_("id", match_ids).execute()
    usernames = [s["username"] for s in profiles.data]
    return {"usernames": usernames}


def get_messages(user_id: str, other_username: str):
    other_id_data = supabase.table("profiles").select("*").eq("username", other_username).single().execute()
    other_id = other_id_data.data["id"]

    if not are_matched(user_id, other_id):
        return None

    messages_data = supabase.table("messages")\
    .select("*")\
    .or_(f"and(sender_id.eq.{user_id},receiver_id.eq.{other_id}),and(sender_id.eq.{other_id},receiver_id.eq.{user_id})")\
    .order("sent_at")\
    .execute()

    messages = []
    for message in messages_data.data:
        message["you"] = 1 if message["sender_id"] == user_id else 0
        messages.append(message)
    return messages


def save_message(sender_id: str, receiver_username: str, content: str):
    receiver_id_data = supabase.table("profiles").select("*").eq("username", receiver_username).single().execute()
    receiver_id = receiver_id_data.data["id"]

    if not are_matched(sender_id, receiver_id):
        return False

    supabase.table("messages").insert({
        "sender_id": sender_id,
        "receiver_id": receiver_id,
        "content": content
    }).execute()
    return True
