package db

func (u User) LanguageOrDefault() UserLang {
	if !u.Language.Valid {
		return UserLangEn
	}
	return u.Language.UserLang
}
