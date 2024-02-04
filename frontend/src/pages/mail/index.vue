<script lang="ts" setup>
import PageWrapper from "@/components/page-wrapper.vue"
import PageContent from "@/components/page-content.vue"
import PageHeader from "@/components/page-header.vue"
</script>

<template>
  <PageWrapper>
    <PageHeader>
      <div class="font-medium text-strong">Mail</div>
    </PageHeader>
    <PageContent>
      <div class="prose prose-sm prose-neutral px-8 py-4">
        <p>
          Um Dokedu Mail zu nutzen, kannst du
          <a href="https://www.thunderbird.net/" target="_blank" class="!cursor-pointer">Thunderbird</a>, Outlook, Apple
          Mail oder jeden anderen gängigen E-Mail-Client verwenden, der
          <a href="https://support.mozilla.org/de/kb/imap-synchronisierung" target="_blank" class="!cursor-pointer">
            IMAP
          </a>
          unterstützt.
        </p>
        <p>Um deinen E-Mail-Client zu konfigurieren, kannst du die folgenden Einstellungen verwenden:</p>
        <h3>IMAP</h3>
        <table>
          <thead>
            <tr>
              <th>Einstellung</th>
              <th>Wert</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Server</td>
              <td>mail.dokedu.org</td>
            </tr>
            <tr>
              <td>Port</td>
              <td>993</td>
            </tr>
            <tr>
              <td>Sicherheit</td>
              <td>SSL/TLS</td>
            </tr>
            <tr>
              <td>Nutzername</td>
              <td>Deine E-Mail Adresse</td>
            </tr>
            <tr>
              <td>Passwort</td>
              <td>Dein Dokedu Passwort</td>
            </tr>
          </tbody>
        </table>
        <p>Wir arbeiten an einem Webmail-Client, können aber noch kein Veröffentlichungsdatum nennen.</p>
      </div>
    </PageContent>
  </PageWrapper>
</template>
