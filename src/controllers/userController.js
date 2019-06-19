import mongoose from "mongoose";
import userSchema from "../models/userModel";
import inviteSchema from "../models/inviteModel";
import { save as SessionSave } from "./sessionController";
import {
	generateRandomCode,
	getAllPermissionsCurrentUser,
	decodeAccess_token
} from "./utilController";

import nodemailer from "nodemailer";
const User = mongoose.model("Users", userSchema);
const Invitation = mongoose.model("Invitations", inviteSchema);

export function getUsers(req, res) {
	decodeAccess_token(req.headers.authorization, user => {
		if (user === false) {
			return res.json({ status: "401", data: "Usted no esta autenticado" });
		} else {
			User.find({}, (error, users) => {
				if (error) return res.json({ status: "500", data: error });
				return res.json({ status: "200", data: users });
			});
		}
	});
}

export function addNewUser(req, res) {
	const { name, email, gender, picture, roles } = req.body;
	decodeAccess_token(req.headers.authorization, users => {
		let user = new User();
		user.name = name;
		user.email = email;
		user.gender = gender;
		user.picture = picture;
		user.roles = roles;
		user.created_by = users._id;
		user.updated_by = users._id;
		user.created_at = new Date();
		user.updated_at = new Date();
		user.save((error, user) => {
			if (error) return res.json({ status: "500", error: error });
			return res.json(user._id);
		});
	});
}

export function findByEmail(req, res) {
	const { email } = req.body;
	return User.find({ email: email }, (error, user) => {
		if (error) return res.json({ status: "500", error: error });
		return res.json(user);
	});
}
export function invite(req, res) {
	let { emails, bodyEmail, subject, roles } = req.body;

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "ivanguevaracollazo@gmail.com",
			pass: "LianetAlejandro*"
		}
	});
	emails.map(email => {
		let invitation = new Invitation();
		invitation.email = email;
		invitation.code = generateRandomCode(email);
		invitation.admin = false;
		invitation.roles = roles;
		invitation.save((error, invitation) => {
			if (error) return res.json({ success: false, error: error });
			let url = `https://dev.futurasit.com/confirm/${invitation.code}`;
			transporter.sendMail(
				{
					from: `Allin-cuba <ivanguevaracollazo@gmail.com>`,
					to: email,
					subject: `${subject}`,
					html: `<table class="body-wrap">
          <tr>
            <td></td>
            <td class="container" bgcolor="#FFFFFF">
        
              <div class="content">
              <table>
                <tr>
                  <td>
                   ${bodyEmail}
                    <!-- Callout Panel -->
                    <p class="callout">
                       Registrese <a href=${url}>aqui! &raquo;</a>
                    </p><!-- /Callout Panel -->					
                                
                    <!-- social & contact -->
                    <table class="social" width="100%">
                      <tr>
                        <td>
                         <!-- column 2 -->
                          <table align="left" class="column">
                            <tr>
                              <td>				
                                              
                                <h5 class="">Informacion de Contacto:</h5>
                                 Correo: <strong><a href="emailto:manager@tourfixer.com">manager@tourfixer.com</a></strong></p>
                        
                              </td>
                            </tr>
                          </table><!-- /column 2 -->
                          
                          <span class="clear"></span>	
                          
                        </td>
                      </tr>
                    </table><!-- /social & contact -->
                                      </td>
                </tr>
              </table>
              </div>                            
            </td>
          </tr>
        </table>`
				},
				(error, info) => {
					if (error) res.json({ success: false });
					return res.json({ success: true });
				}
			);
		});
	});
}

export function confirm(req, res) {
	let { code } = req.params;
	Invitation.findOne({ code: code }, (error, invitation) => {
		if (error) return res.status(500).json({ error: error });
		if (invitation) {
			let user = new User();
			user.email = invitation.email;
			user.name = invitation.email;
			user.roles = invitation.roles;
			user.created_by = invitation.created_by;
			user.updated_by = invitation.created_by;
			user.created_at = new Date();
			user.updated_at = new Date();
			user.save((error, user) => {
				if (error) return res.status(500).json({ error: error });
				invitation.remove(error => {
					if (error) return res.status(500).json({ error: error });
					return res.json({ success: true });
				});
			});
		} else return res.status(500).json({ success: false });
	});
}

export function updateUser(req, res) {
	const {
		_id,
		name,
		email,
		company,
		webSite,
		schoolLevel,
		gender,
		biographicalSynt,
		language,
		contact,
		picture,
		roles
	} = req.body;
	decodeAccess_token(req.headers.authorization, user => {
		User.findById(_id, (error, user) => {
			if (error) return res.json({ status: "500", error: error });
			user._id = _id;
			user.name = name;
			user.email = email;
			user.company = company;
			user.webSite = webSite;
			user.schoolLevel = schoolLevel;
			user.gender = gender;
			user.biographicalSynt = biographicalSynt;
			user.language = language;
			user.contact = contact;
			user.picture = picture;
			user.roles = roles;
			user.updated_by = user._id;
			user.updated_at = new Date();
			user.initial = false;
			user.save((error, user) => {
				if (error) return res.json({ status: "500", error: error });
				return res.json(user._id);
			});
		});
	});
}

export function deleteUser(req, res) {
	User.deleteOne({ _id: req.params._id }, (error, user) => {
		if (error) return res.json({ status: "500", data: error });
		return res.json({ status: "200", data: user._id });
	});
}

export function authUser(req, res) {
	var fecht = require("isomorphic-fetch");
	const { token } = req.body;
	try {
		fetch(`https://futurasit.auth0.com/userinfo`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: "Bearer " + token
			}
		})
			.then(res => res.json())
			.then(respon => {
				return User.findOne({ email: respon.email }, (error, user) => {
					if (error) {
						return res.json({ status: "500", error: error });
					} else {
						if (user.initial) {
							User.findById(user._id, (error, use) => {
								if (error) return res.json({ status: "500", error: error });
								use.name = respon.name;
								use.email = respon.email;
								use.picture = respon.picture;
								use.gender = respon.gender;
								user.updated_by = use._id;
								user.updated_at = new Date();
								use.initial = false;
								use.save((error, use) => {
									if (error) {
										return res.json({ status: "500", error: error });
									} else {
										var access_token_api = generateRandomCode(user.name);
										let session = {};
										session.access_token_api = access_token_api;
										session.access_token_auth0 = token;
										session.user_id = user._id;
										session.user_email = user.email;
										session.user_name = user.name;
										SessionSave(session, (error, session) => {
											if (error) {
												return res.json({ status: "500", error: error });
											} else {
												let userToken = {};
												userToken.name = use.name;
												userToken.email = use.email;
												userToken.picture = use.picture;
												userToken._id = use._id;
												getAllPermissionsCurrentUser(user, permissions => {
													userToken.permissions = permissions;
													return res.json({
														status: true,
														token: access_token_api,
														user: userToken
													});
												});
											}
										});
									}
								});
							});
						} else {
							var access_token_api = generateRandomCode(user.name);
							let session = {};
							session.access_token_api = access_token_api;
							session.access_token_auth0 = token;
							session.user_id = user._id;
							session.user_email = user.email;
							session.user_name = user.name;
							SessionSave(session, (error, session) => {
								if (error) {
									return res.json({ status: "500", error: error });
								} else {
									let userToken = {};
									userToken.name = user.name;
									userToken.email = user.email;
									userToken.picture = user.picture;
									userToken._id = user._id;
									getAllPermissionsCurrentUser(user, permissions => {
										userToken.permissions = permissions;
										return res.json({
											status: "200",
											token: access_token_api,
											user: userToken
										});
									});
								}
							});
						}
					}
				});
			});
	} catch (error) {
		return res.json({ status: error });
		console.log("Error in retrieving userinfo from Auth0: " + error.message);
	}
}

export function userFindByRole(req, res) {
	const { role } = req.body;
	User.find({ roles: role }, (error, users) => {
		if (error) return res.json({ status: "500", error: error });
		return res.json(users);
	});
}

export function getUser(req, res) {
	const { _id } = req.params;
	return User.findOne({ _id: _id }, (error, user) => {
		if (error) return res.json({ status: "500", data: error });
		return res.json({ status: "200", data: user });
	});
}
