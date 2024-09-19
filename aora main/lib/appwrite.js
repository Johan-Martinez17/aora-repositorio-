import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "co.edu.sena",
  projectId: "66ccf16b001cce02537d",
  databaseId: "66ccf21e0028af76c9b4",
  userCollectionId: "66ccf24d0039de83909d",
  videoCollectionId: "66ccf27a0027f58094dd",
  storageId: "66ccf3d1003b3e6d3e09",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId
} = config;

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);


export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error("Account creation failed");

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error.message); // Muestra el mensaje de error
  }
}


export async function signIn(email, password) {
  try {
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error.message); // Muestra el mensaje de error
  }
}


export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error.message); // Muestra el mensaje de error
  }
}


export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw new Error("No account found");

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser || currentUser.documents.length === 0) throw new Error("No user found");

    return currentUser.documents[0];
  } catch (error) {
    console.log(error.message); // Muestra el mensaje de error
    return null;
  }
}


export const getAllPosts = async () => {
  try{ 
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId 
    )
    return posts.documents

  } catch (error) {
    throw new Error(error);
  }
} 