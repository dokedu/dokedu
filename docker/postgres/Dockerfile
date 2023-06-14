FROM postgres:latest

RUN /usr/sbin/pg_updatedicts

COPY hunspell_de_compounds.dict /usr/share/postgresql/$PG_MAJOR/tsearch_data/de_de.dict
COPY hunspell_de_compounds.affix /usr/share/postgresql/$PG_MAJOR/tsearch_data/de_de.affix

RUN /etc/init.d/postgresql reload