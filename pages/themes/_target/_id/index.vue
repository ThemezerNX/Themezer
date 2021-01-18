<template>
  <v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
    <LoadingOverlay :loading="!!$apollo.loading">
      <v-sheet v-if="theme" no-gutters class="pa-2 box">
        <v-row class="ma-0">
          <v-col
              cols="12"
              xs="12"
              :sm="landscape ? 8 : 12"
              md="9"
              class="pa-2"
          >
            <v-img
                aspect-ratio="1.7778"
                :src="theme.preview.original"
                cover
                class="overlay-image"
                :style="backgroundStyle"
            />
          </v-col>
          <v-col
              cols="12"
              xs="12"
              :sm="landscape ? 4 : 12"
              md="3"
              class="pa-2"
              style="position: relative;"
          >
            <h1>
              {{ theme.details.name }}
            </h1>
            <div class="subtitle-1">
              By
              <nuxt-link
                  class="font-weight-bold"
                  :to="`/creators/${theme.creator.id}`"
              >
                {{ theme.creator.display_name }}
              </nuxt-link>
            </div>
            <div
                v-if="theme.details.description"
                v-linkified:options="{
								className: 'font-weight-medium'
							}"
                class="font-weight-thin subtitle-1"
                v-html="theme.details.description"
            />

            <div>
              <v-chip
                  v-for="(category, i) in theme.categories"
                  :key="i"
                  class="ma-2"
                  pill
                  small
              >
                {{ category }}
              </v-chip>
            </div>

            <ButtonDivider>
              <LikeButton
                  v-if="$auth.loggedIn"
                  :id="theme.id"
                  :count="
									theme.like_count > 0
										? theme.like_count
										: $auth.user.liked.themes
												.map((t) => t.id)
												.includes(theme.id)
										? 1
										: 0
								"
                  type="themes"
                  :value="
									$auth.user.liked.themes
										.map((t) => t.id)
										.includes(theme.id)
								"
              />
              <ShareButton
                  type="theme"
                  :name="theme.details.name"
                  :creator="theme.creator.display_name"
              />
              <EditButton v-if="mayModerate" type="theme"/>
              <ReportButton
                  v-if="!mayModerate"
                  type="theme"
                  :nsfw="theme.categories.includes('NSFW')"
              />
            </ButtonDivider>

            <h3>
              Details
            </h3>
            <div class="font-weight-light body-2">
              <span class="font-weight-medium">ID: </span>
              {{ theme.id }}
            </div>
            <div class="font-weight-light body-2">
              <span class="font-weight-medium">Version: </span>
              {{ theme.details.version }}
            </div>
            <div class="font-weight-light body-2">
							<span class="font-weight-medium"
              >Last Updated:</span
              >
              {{ niceDate(theme.last_updated) }}
            </div>
            <div class="font-weight-light body-2">
              <span class="font-weight-medium">Layout: </span>
              <nuxt-link
                  v-if="theme.layout"
                  class="font-weight-bold"
                  :to="
									`/layouts/${fileNameToWebName(
										theme.layout.target
									)}/${createUrlString(
										theme.layout.id,
										theme.layout.details.name
									)}`
								"
              >
                {{ theme.layout.details.name }}
              </nuxt-link>
              <template v-else>
                <a
                    class="font-weight-bold"
                    href="#"
                    @click="
										downloadFileUrl(
											`${API_ENDPOINT}cdn/themes/${theme.id}/layout.json`,
											'application/json',
											`${theme.details.name} (custom layout).json`
										)
									"
                >
                  Custom
                </a>
              </template>
            </div>
            <div
                v-if="
								theme.layout &&
									theme.pieces &&
									theme.pieces.length > 0
							"
                class="font-weight-light body-2"
            >
              <span class="font-weight-medium">Options: </span>
              {{ optionsString(theme.pieces) }}
            </div>
            <div
                v-if="theme.bg_type"
                class="font-weight-light body-2"
            >
              <span class="font-weight-medium">Background: </span>
              <a
                  class="font-weight-bold"
                  target="_blank"
                  :href="
									`${API_ENDPOINT}cdn/themes/${theme.id}/image.${theme.bg_type}`
								"
              >
                {{ theme.bg_type.toUpperCase() }}
              </a>
            </div>
            <div class="font-weight-light body-2">
              <span class="font-weight-medium">Downloads: </span>
              {{ theme.dl_count }}
            </div>

            <ButtonDivider>
              <DownloadButton
                  tooltip="Download theme"
                  :download-function="downloadTheme"
                  :loading="loadingDownload"
              />
            </ButtonDivider>

            <ThemeInstaller :id="theme.id" type="theme"/>

            <ButtonDivider/>

            <div v-if="theme.pack">
              <h3 style="position: relative;">
                Pack
                <v-tooltip v-model="showPackInfo" top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                        rounded
                        icon
                        style="position: absolute; top: 0; color: black;"
                        class="ml-1 pa-0 grey lighten-1"
                        width="14"
                        height="14"
                        v-on="on"
                        @click="packDialog = true"
                    >
                      ?
                    </v-btn>
                  </template>
                  <span>What is this?</span>
                </v-tooltip>
              </h3>
              <div class="subtitle-1">
                This Theme is part of the the following Pack:
              </div>
              <nuxt-link
                  :to="
									`/packs/${createUrlString(
										theme.pack.id,
										theme.pack.details.name
									)}`
								"
                  class="subtitle-1 font-weight-bold"
              >
                {{ theme.pack.details.name + (theme.pack.categories.includes('NSFW') ? ' (NSFW!)' : '') }}
              </nuxt-link>
            </div>
          </v-col>
        </v-row>
        <v-dialog v-model="packDialog" max-width="400">
          <v-card>
            <v-card-title class="headline"
            >What is a Pack?
            </v-card-title
            >

            <v-card-text>
              Packs are zips with multiple themes created by the
              same user. It can contain multiple themes for a
              single menu.
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                  rounded
                  color="primary"
                  text
                  @click="packDialog = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-sheet>
    </LoadingOverlay>
  </v-container>
</template>

<script>
import Vue from 'vue'
import shared from '@/layouts/details/SharedScript'
import targetParser from '@/components/mixins/targetParser'
import urlParser from '@/components/mixins/urlParser'
import {theme, downloadTheme} from '@/graphql/Theme.gql'

export default Vue.extend({
  components: {
    ThemeInstaller: () =>
        import('@/components/sections/ThemeInstaller.vue'),
    ButtonDivider: () => import('@/components/buttons/ButtonDivider.vue'),
    DownloadButton: () => import('@/components/buttons/DownloadButton.vue'),
    ReportButton: () => import('@/components/buttons/ReportButton.vue'),
    LikeButton: () => import('@/components/buttons/LikeButton.vue'),
    ShareButton: () => import('@/components/buttons/ShareButton.vue'),
    EditButton: () => import('@/components/buttons/EditButton.vue'),
    LoadingOverlay: () => import('@/components/LoadingOverlay.vue')
  },
  mixins: [shared, targetParser, urlParser],
  data() {
    return {
      API_ENDPOINT: process.env.API_ENDPOINT,
      isPageOwner: false,
      showPackInfo: false,
      packDialog: false,
      loadingDownload: false
    }
  },
  computed: {
    backgroundStyle() {
      return ''
      // if (this.theme.details.color) {
      // 	return `background: ${this.theme.details.color};`
      // } else {
      // 	return `background: #e2e2e2;`
      // }
    },
    mayModerate() {
      return this.isPageOwner || this.$auth.user?.isAdmin
    }
  },
  apollo: {
    theme: {
      query: theme,
      variables() {
        return {
          id: this.id
        }
      },
      result({data}) {
        if (data && data.theme) {
          this.isPageOwner =
              this.$auth.loggedIn &&
              data.theme.creator.id === this.$auth.user.id

          this.updateUrlString(
              data.theme.id,
              data.theme.details.name,
              this.fileNameToWebName(data.theme.target)
          )
        }
      },
      prefetch: true
    }
  },
  methods: {
    optionsString(usedPieces) {
      const values = []
      if (usedPieces && usedPieces.length > 0) {
        usedPieces.forEach((piece) => {
          if (piece.value.value === 'true') {
            values.push(piece.name)
          } else {
            values.push(`${piece.name}: ${piece.value.value}`)
          }
        })
      }
      return values.join(', ')
    },
    downloadTheme() {
      this.loadingDownload = true
      const usedPieces = []

      if (this.theme.pieces) {
        for (let i = 0; i < this.theme.pieces.length; i++) {
          usedPieces.push(this.theme.pieces[i].value.uuid)
        }
      }

      this.$apollo
          .mutate({
            mutation: downloadTheme,
            variables: {
              id: this.theme.id,
              piece_uuids: usedPieces.length > 0 ? usedPieces : null
            }
          })
          .then(({data}) => {
            this.loadingDownload = false

            this.downloadFileUrl(
                data.downloadTheme.url,
                undefined,
                data.downloadTheme.filename
            )
          })
          .catch((err) => {
            this.$snackbar.error(err)
            this.loadingDownload = false
          })
    }
  },
  head() {
    if (this.theme) {
      const metaTitle = `${this.theme.details.name}${
          this.theme.categories.includes('NSFW') ? ' (NSFW!)' : ''
      } | ${this.targetName()} | Themes`
      const metaDesc = this.theme.details.description
      const metaImg = !this.theme.categories.includes('NSFW')
          ? this.theme.preview.original
          : null

      return {
        title: metaTitle,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: metaDesc
          },
          {
            hid: 'og:title',
            name: 'og:title',
            property: 'og:title',
            content: metaTitle
          },
          {
            hid: 'og:description',
            name: 'og:description',
            property: 'og:description',
            content: metaDesc
          },
          {
            hid: 'og:image',
            name: 'og:image',
            property: 'og:image',
            content: metaImg
          }
        ]
      }
    }
  }
})
</script>
