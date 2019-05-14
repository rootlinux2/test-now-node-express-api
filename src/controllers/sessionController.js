import mongoose from "mongoose";
import sessionSchema from "../models/sessionModel";
const Session = mongoose.model("Sessions", sessionSchema);

export function index(req, res) {
  Session.find((error, sessions) => {
    if (error) return res.json({ status: "500", error: error });
    return res.json(sessions);
  });
}

export function store({ access_token_api, access_token_auth0, user_id, user_email }, next) {
  let session = new Session();
  session.access_token_api = access_token_api;
  session.access_token_auth0 = access_token_auth0;
  session.user_id = user_id;
  session.user_email = user_email;
  session.created_at = new Date();
  session.save((error, session) => {
    if (error) return res.json({ status: "500", error: error });
    next(error, session);
  });
}

export function save(
  { access_token_api, access_token_auth0, user_name, user_email, user_id },
  next
) {
  let session = new Session();
  session.access_token_api = access_token_api;
  session.access_token_auth0 = access_token_auth0;
  session.user_id = user_id;
  session.user_email = user_email;
  session.user_name = user_name;
  session.created_at = new Date();
  session.save((error, session) => {
    next(error, session);
  });
}

export function findById(req, res) {
  const { _id } = req.body;
  return Session.findOne({ _id: _id }, (error, sponsor) => {
    if (error) return res.json({ status: "500", error: error });
    return res.json(sponsor);
  });
}
export function findByAccessTokenApi(access_token_api, next) {
  return Session.findOne({ access_token_api: access_token_api }, (error, session) => {
    if (error) next({ status: "500" });
    return next(session);
  });
}
